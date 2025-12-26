<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class Kernel extends Command
{
    protected $commands = [
    \App\Console\Commands\MigrateExcludeCommand::class,
    ];

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:kernel';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
    }
}
