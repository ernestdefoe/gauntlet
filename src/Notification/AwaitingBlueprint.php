<?php

namespace ErnestDefoe\Gauntlet\Notification;


/** For organisers: both sides agree on a result that needs staff to confirm it. */
class AwaitingBlueprint extends TournamentBlueprint
{
    public static function getType(): string
    {
        return 'gauntletAwaiting';
    }
}
