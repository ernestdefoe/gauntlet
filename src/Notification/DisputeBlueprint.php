<?php

namespace ErnestDefoe\Gauntlet\Notification;

use Flarum\Notification\MailableInterface;

/** For organisers: the two sides reported different results. */
class DisputeBlueprint extends TournamentBlueprint implements MailableInterface
{
    public static function getType(): string
    {
        return 'gauntletDispute';
    }

    protected static function emailView(): string
    {
        return 'dispute';
    }
}
