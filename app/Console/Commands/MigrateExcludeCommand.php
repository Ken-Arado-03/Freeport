<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MigrateExcludeCommand extends Command
{
    protected $signature = 'migrate:exclude {--tables=}';
    protected $description = 'Drop specific tables and run migrations';

    // Tables to drop
    protected $tablesToDrop = [
        'cache',
        'password_reset_tokens',
        'cache_locks',
    ];

    public function handle()
    {
        if ($this->option('tables')) {
            $this->tablesToDrop = array_merge(
                $this->tablesToDrop,
                explode(',', $this->option('tables'))
            );
            $this->tablesToDrop = array_unique($this->tablesToDrop);
        }

        $this->dropTables();
        $this->call('migrate');
    }

    protected function dropTables()
    {
        if (empty($this->tablesToDrop)) {
            $this->warn('No tables specified to drop.');
            return;
        }

        $this->info('Dropping specified tables: ' . implode(', ', $this->tablesToDrop));

        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        foreach ($this->tablesToDrop as $table) {
            $table = trim($table);
            if (Schema::hasTable($table)) {
                Schema::dropIfExists($table);
                $this->info("Dropped: {$table}");
            } else {
                $this->warn("Table does not exist: {$table}");
            }
        }

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }
}