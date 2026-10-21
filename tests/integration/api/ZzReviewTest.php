<?php

namespace ErnestDefoe\Gauntlet\Tests\integration\api;

use Carbon\Carbon;
use ErnestDefoe\Gauntlet\Tests\integration\GauntletTestCase;
use PHPUnit\Framework\Attributes\Test;

class ZzReviewTest extends GauntletTestCase
{
    protected function allowedRepeatedQueries(): array
    {
        return array_merge(parent::allowedRepeatedQueries(), ['fof_badge_user', 'notifications', 'gauntlet_entrant_members', 'fof_badges', 'picks', 'gauntlet', 'users', 'tags', 'group']);
    }

    private function staff(array $settings, array $names, int $actor = 1): array
    {
        $t = $this->tournament($settings + ['entryMode' => 'staff', 'seeding' => 'manual'], true, $actor);
        foreach ($names as $name) {
            $body = is_int($name) ? ['picksTeamId' => $name] : ['name' => $name];
            [$status, , $raw] = $this->json('POST', "/api/gauntlet/tournaments/{$t['id']}/entrants", $actor, $body);
            $this->assertSame(200, $status, $raw);
        }

        return $this->start($t['id'], $actor);
    }

    /** POC 1: with a lock time set, a member picks after results are known and scores them. */
    #[Test]
    public function poc_picks_after_results_with_lock_time(): void
    {
        Carbon::setTestNow('2030-06-01 12:00:00');
        $t = $this->staff(['predictions' => true, 'predictionsLockAt' => '2030-06-02T18:00:00Z'], ['A', 'B', 'C', 'D']);
        $semi1 = $this->match($t, 'W:1:1');
        $semi2 = $this->match($t, 'W:1:2');
        $this->assertSame(200, $this->json('POST', "/api/gauntlet/matches/{$semi1['id']}/resolve", 1, ['score1' => 3, 'score2' => 1])[0]);
        $this->assertSame(200, $this->json('POST', "/api/gauntlet/matches/{$semi2['id']}/resolve", 1, ['score1' => 0, 'score2' => 2])[0]);

        // Member 5 now knows both semi-final winners and picks them.
        [$status, $body, $raw] = $this->json('PUT', "/api/gauntlet/tournaments/{$t['id']}/prediction", 5, ['picks' => [
            'W:1:1' => $semi1['entrant1Id'], 'W:1:2' => $semi2['entrant2Id'], 'W:2:1' => $semi1['entrant1Id'],
        ]]);
        fwrite(STDERR, "\nPOC1 status=$status score=".($body['data']['score'] ?? '-')." correct=".($body['data']['correct'] ?? '-')."\n");
        $this->assertSame(200, $status, $raw);
        $this->assertSame(20, $body['data']['score']);
    }

    /** POC 2: changing the game after rated results makes reset revert the wrong game's ratings. */
    #[Test]
    public function poc_game_change_after_start_corrupts_ratings(): void
    {
        $t = $this->tournament(['game' => 'Chess']);
        $this->signUp($t['id'], 3);
        $this->signUp($t['id'], 4);
        $t = $this->playOpen($this->start($t['id']));
        $this->assertSame('finished', $t['status']);
        [$status, , $raw] = $this->json('PATCH', "/api/gauntlet/tournaments/{$t['id']}", 1, ['game' => 'Go']);
        $this->assertSame(200, $status, $raw);
        // Correct the final (reverts with the new game key), then reset.
        $final = $this->match($t, 'W:1:1');
        [$status, , $raw] = $this->json('POST', "/api/gauntlet/matches/{$final['id']}/resolve", 1, ['score1' => 0, 'score2' => 2]);
        $this->assertSame(200, $status, $raw);
        $this->json('POST', "/api/gauntlet/tournaments/{$t['id']}/reset", 1);
        $rows = $this->database()->table('gauntlet_ratings')->orderBy('game')->orderBy('subject_id')->get(['game', 'subject_id', 'rating', 'played', 'wins', 'losses'])->map(fn ($r) => (array) $r)->all();
        fwrite(STDERR, "\nPOC2 ratings after game change + correct + reset: ".json_encode($rows)."\n");
        $this->assertNotSame(0, (int) $this->database()->table('gauntlet_ratings')->where('game', 'chess')->sum('played'), 'chess result never taken back');
    }

    /** POC 3: organiser B links his match to an OLD finished game; admin's live match in another tournament is settled by it. */
    #[Test]
    public function poc_cross_tournament_settle_via_picks_event(): void
    {
        $this->extension('ernestdefoe-picks');
        $this->prepareDatabase(['group_permission' => [['group_id' => 3, 'permission' => 'gauntlet.create']]]);
        $now = Carbon::now();
        $this->prepareDatabase(['picks_teams' => [
            ['id' => 1, 'name' => 'Oregon', 'slug' => 'oregon', 'logo_custom' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'name' => 'Georgia', 'slug' => 'georgia', 'logo_custom' => 0, 'created_at' => $now, 'updated_at' => $now],
        ]]);

        $victim = $this->staff([], [1, 2], 1);
        $this->assertSame('open', $this->match($victim, 'W:1:1')['status']);

        $mine = $this->staff(['title' => 'Mine'], [1, 2], 2);
        $old = $this->database()->table('picks_events')->insertGetId([
            'home_team_id' => 2, 'away_team_id' => 1, 'home_score' => 50, 'away_score' => 0, 'result' => 'home', 'status' => 'finished',
            'match_date' => $now->copy()->subYears(3), 'cutoff_date' => $now->copy()->subYears(3), 'neutral_site' => 0,
        ]);
        $m = $this->match($mine, 'W:1:1');
        [$status, , $raw] = $this->json('PATCH', "/api/gauntlet/matches/{$m['id']}", 2, ['picksEventId' => $old]);
        $this->assertSame(200, $status, $raw);

        $victim = $this->show($victim['id']);
        $vm = $this->match($victim, 'W:1:1');
        fwrite(STDERR, "\nPOC3 victim tournament status={$victim['status']} match status={$vm['status']} score={$vm['score1']}-{$vm['score2']} picksEventId={$vm['picksEventId']}\n");
        $this->assertSame('completed', $vm['status']);
    }

    /** POC 4: autoLink takes the OLDEST game in a 14-day window, so a finished regular-season meeting settles the bracket match at start. */
    #[Test]
    public function poc_autolink_uses_stale_finished_game(): void
    {
        $this->extension('ernestdefoe-picks');
        $now = Carbon::now();
        $this->prepareDatabase(['picks_teams' => [
            ['id' => 1, 'name' => 'Oregon', 'slug' => 'oregon', 'logo_custom' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'name' => 'Georgia', 'slug' => 'georgia', 'logo_custom' => 0, 'created_at' => $now, 'updated_at' => $now],
        ]]);
        // Last week's meeting (finished), and the real bracket game next week.
        $this->database()->table('picks_events')->insert([
            ['home_team_id' => 1, 'away_team_id' => 2, 'home_score' => 10, 'away_score' => 3, 'result' => 'home', 'status' => 'finished',
                'match_date' => $now->copy()->subDays(7), 'cutoff_date' => $now->copy()->subDays(7), 'neutral_site' => 0],
            ['home_team_id' => 2, 'away_team_id' => 1, 'home_score' => null, 'away_score' => null, 'result' => null, 'status' => 'scheduled',
                'match_date' => $now->copy()->addDays(7), 'cutoff_date' => $now->copy()->addDays(7), 'neutral_site' => 1],
        ]);
        $t = $this->staff([], [1, 2], 1);
        $t = $this->show($t['id']);
        $m = $this->match($t, 'W:1:1');
        fwrite(STDERR, "\nPOC4 at start: tournament={$t['status']} match={$m['status']} event={$m['picksEventId']}\n");
        $this->assertSame('completed', $m['status']);
    }

    /** POC 5: an organiser without the reward permission hands the admin-set badge to both finalists by correcting the final. */
    #[Test]
    public function poc_reward_badge_paid_twice_via_correction(): void
    {
        $this->extension('fof-badges');
        $this->prepareDatabase(['group_permission' => [['group_id' => 3, 'permission' => 'gauntlet.create']]]);
        $this->prepareDatabase(['fof_badges' => [['id' => 1, 'name' => 'Champion', 'slug' => 'champion', 'icon' => 'fas fa-trophy', 'is_active' => 1, 'is_visible' => 1]]]);

        $t = $this->tournament([], true, 2);
        // An admin puts a prize on the member's tournament.
        [$status, , $raw] = $this->json('PATCH', "/api/gauntlet/tournaments/{$t['id']}", 1, ['rewardBadgeId' => 1]);
        $this->assertSame(200, $status, $raw);
        $this->signUp($t['id'], 3);
        $this->signUp($t['id'], 4);
        $t = $this->start($t['id'], 2);
        $final = $this->match($t, 'W:1:1');
        $this->assertSame(200, $this->json('POST', "/api/gauntlet/matches/{$final['id']}/resolve", 2, ['score1' => 2, 'score2' => 0])[0]);
        $this->assertSame(200, $this->json('POST', "/api/gauntlet/matches/{$final['id']}/resolve", 2, ['score1' => 0, 'score2' => 2])[0]);
        $held = $this->database()->table('fof_badge_user')->where('badge_id', 1)->orderBy('user_id')->pluck('user_id')->all();
        fwrite(STDERR, "\nPOC5 champion badge holders: ".json_encode($held)."\n");
        $this->assertSame([3, 4], $held);
    }

    /** POC 6: Swiss with all but one withdrawn pairs a bye-only round and never finishes. */
    #[Test]
    public function poc_swiss_stuck_after_withdrawals(): void
    {
        $t = $this->tournament(['format' => 'swiss', 'swissRounds' => 3]);
        foreach ([3, 4, 5, 6] as $u) {
            $this->signUp($t['id'], $u);
        }
        $t = $this->start($t['id']);
        $byUser = array_flip($this->captains($t));
        foreach ([4, 5, 6] as $u) {
            [$status, , $raw] = $this->json('DELETE', "/api/gauntlet/entrants/{$byUser[$u]}", $u);
            $this->assertSame(200, $status, $raw);
        }
        $t = $this->show($t['id']);
        $live = array_filter($t['matches'], fn ($m) => in_array($m['status'], ['open', 'reported', 'disputed', 'awaiting'], true));
        fwrite(STDERR, "\nPOC6 swiss: status={$t['status']} round={$t['currentRound']} live=".count($live).' statuses='.json_encode(array_column($t['matches'], 'status'))."\n");
        $this->assertSame('running', $t['status']);
        $this->assertCount(0, $live);
    }
}
