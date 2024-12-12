<?php



/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

class maintainBackup extends maintainBase{    

    function fn_backup(){

        
        //$this->fn_varDump("fn_backup", "backup", true);

        global $SYSTEM_ADMINISTRATOR_USERNAME, $SYSTEM_ADMINISTRATOR_PASSWORD;

        $host = 'localhost';
        $user = $SYSTEM_ADMINISTRATOR_USERNAME;
        $password = $SYSTEM_ADMINISTRATOR_PASSWORD;

        $user = "remote@mycode.buzz";
        $password = "MyCode.Buzz.!00";
        
        $backupBaseDir = 'd:/backup/';

        

        // Get the current and previous month
        $currentMonth = date('Y-m');
        $previousMonth = date('Y-m', strtotime('first day of last month'));

        $currentDate = date('Y-m-d');

        // Define the backup directory for the current month
        $currentBackupMonth = $backupBaseDir . $currentMonth . '/';
        $currentBackupDate = $currentBackupMonth . $currentDate . '/';

        
        // Create the current month's backup directory if it doesn't exist
        if (!is_dir($currentBackupMonth)) {
            mkdir($currentBackupMonth, 0777, true);
        }

        // Create the current month's backup directory if it doesn't exist
        if (!is_dir($currentBackupDate)) {
            mkdir($currentBackupDate, 0777, true);
        }

        

        // Delete the previous month's backup directory if it exists
        $previousBackupDir = $backupBaseDir . $previousMonth . '/';
        if (is_dir($previousBackupDir)) {
            array_map('unlink', glob("$previousBackupDir/*.*"));
            rmdir($previousBackupDir);
        }

        /*
        try {
            $pdo = new PDO("mysql:host=$host", $user, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

           
            $databases = $pdo->query('SHOW DATABASES')->fetchAll(PDO::FETCH_COLUMN);

            
            foreach ($databases as $database) {
                if (in_array($database, ['information_schema', 'mysql', 'performance_schema', 'sys'])) {
                    continue; // Skip system databases
                }

                $backupFile = $currentBackupDate . $database  . '.sql';

                $this->fn_varDump($backupFile, "backupFile", true);
                
                $command = "mysqldump --host=$host --user=$user --password=$password $database > $backupFile";
                system($command, $output);

                

                //$this->fn_varDump($output, "output", true);
                
               
            }

            
            
        } catch (PDOException $e) {
            
            $this->fn_varDump($e->getMessage(), "Connection failed", true);
        }
        //*/

        
        /*
        $source=$currentBackupDate;
        $destination=$currentBackupMonth."$currentDate.zip";
        $this->fn_zipFolder($source, $destination);
        
        $source=$destination;
        $destination="D:/var/www/html/vm-xdesign/vopsys/"."$currentDate.zip";        
        rename($source, $destination);
        //*/

        $pathMySQLDump="C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\";

        if (!is_dir($pathMySQLDump)) {
            $this->fn_varDump(false, "folder found", true);
        }
        else{
            $this->fn_varDump(true, "folder found", true);
        }


        //*
        $backupFile = $currentBackupMonth . 'all-databases.sql';
        //$command = $pathMySQLDump."mysqldump.exe --host=$host --user=$user --password=$password --all-databases  > D:/all-databases.sql";
        $command = "mysqldump --host=$host --user=$user --password=$password --all-databases  > D:/all-databases.sql";
        $this->fn_varDump($command, "command", true);
        system($command, $output);

        /*
        exec($command, $output, $return_var);
        $str_value=var_export($output, true);
        $this->fn_varDump($output, "output", true);     
        $str_value=var_export($return_var, true);
        $this->fn_addEcho ("return_var: ".$str_value);                  
        //*/    
          
        

        //$source=$backupFile;
        //$destination=$currentBackupMonth."all-databases.zip";
        //$this->fn_zipFolder($source, $destination);
        
        //$source=$destination;
        //$destination="D:/var/www/html/vm-xdesign/vopsys/"."all-databases.zip";        
        //rename($source, $destination);
        //*/
    


        $this->fn_varDump("ALL COMPLETEx", "Status", true);
        
    }

    function fn_zipFolder($source, $destination) {

        
        //return;
        if (!extension_loaded('zip') || !file_exists($source)) {
            return false;
        }
      
    
        $zip = new ZipArchive();
        if (!$zip->open($destination, ZipArchive::CREATE)) {
            return false;
        }
    
        $source = realpath($source);
        if (is_dir($source)) {
            $iterator = new RecursiveDirectoryIterator($source);
            // Skip dot files while iterating
            $iterator->setFlags(RecursiveDirectoryIterator::SKIP_DOTS);
            $files = new RecursiveIteratorIterator($iterator, RecursiveIteratorIterator::SELF_FIRST);
    
            foreach ($files as $file) {
                $filePath = $file->getRealPath();
                $relativePath = substr($filePath, strlen($source) + 1);
    
                if ($file->isDir()) {
                    $zip->addEmptyDir($relativePath);
                } else {
                    $zip->addFile($filePath, $relativePath);
                }
            }
        } else {
            $zip->addFile($source, basename($source));
        }
    
        return $zip->close();
    }
    
   
   
}