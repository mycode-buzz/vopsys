<?php



/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

class maintainBackup extends maintainBase{    
    
    function fn_transferdb(){
        $this->fn_doTransferdb();
        $this->fn_setMessage("TransferDB to Live Server is COMPLETE");        
    }
    function fn_doTransferdb(){

        global $REMOTE_ADMINISTRATOR_USERNAME, $REMOTE_ADMINISTRATOR_PASSWORD, $REMOTE_SERVER_HOST;

        $str_nameFolderDrive="D:/";
        $str_nameFolderBase="backup/";
        $str_pathFolderBase=$str_nameFolderDrive.$str_nameFolderBase;        
        $str_pathVopsys=$str_nameFolderDrive."var/www/html/vm-xdesign/vopsys/";        
        $str_nameDump="all-databases";
        $str_nameDumpFile=$str_nameDump.".sql";
        $str_nameDumpZip=$str_nameDump.".zip";
        $str_pathDumpFile=$str_nameFolderDrive.$str_nameDumpFile;        
        $str_pathDumpZip=$str_nameFolderDrive.$str_nameDumpZip;                
        $str_pathVopsysZip=$str_pathVopsys.$str_nameDumpZip;        
        
        $command="mysql -u $REMOTE_ADMINISTRATOR_USERNAME --password=$REMOTE_ADMINISTRATOR_PASSWORD --host $REMOTE_SERVER_HOST < \"$str_pathDumpFile\"";
        $this->fn_varDump($command, "command", true);        
        system($command, $output);        
    }

    function fn_backup(){
        $this->fn_doBackup();
        $this->fn_setMessage("Backup is COMPLETE");        
    }
    function fn_doBackup(){

        $this->fn_varDump("fn_doBackup", "backup", true);               
    
    
        global $REMOTE_ADMINISTRATOR_USERNAME, $REMOTE_ADMINISTRATOR_PASSWORD;
    
        $host = 'localhost';
        
        $str_nameFolderDrive="D:/";
        $str_nameFolderBase="backup/";
        $str_pathFolderBase=$str_nameFolderDrive.$str_nameFolderBase;        
        $str_pathVopsys=$str_nameFolderDrive."var/www/html/vm-xdesign/vopsys/";        
        $str_nameDump="all-databases";
        $str_nameDumpFile=$str_nameDump.".sql";
        $str_nameDumpZip=$str_nameDump.".zip";
        $str_pathDumpFile=$str_nameFolderDrive.$str_nameDumpFile;        
        $str_pathDumpZip=$str_nameFolderDrive.$str_nameDumpZip;                
        $str_pathVopsysZip=$str_pathVopsys.$str_nameDumpZip;        
    
        
    
        // Get the current and previous month
        $date_year = date('Y');
        $date_month = date('Y-m');
        $date_monthPrevious = date('Y-m', strtotime('first day of last month'));
        $date_day = date('Y-m-d');        
        $date_time = date('Y-m-d-H-i-s');                        
    
        
    
        // Define the backup directory for the current month
        $str_pathYear = $str_pathFolderBase . $date_year . '/';        
        $str_pathMonth = $str_pathYear . $date_month . '/';
        $str_pathDate = $str_pathMonth . $date_day;
        $str_pathDateTime = $str_pathMonth . $date_time;        
        $str_pathDestination = $str_pathDateTime;
    
        // Create the current year's backup directory if it doesn't exist
        if (!is_dir($str_pathFolderBase)) {
            mkdir($str_pathFolderBase, 0777, true);
        }
    
        // Create the current year's backup directory if it doesn't exist
        if (!is_dir($str_pathYear)) {
            mkdir($str_pathYear, 0777, true);
        }
        
        // Create the current month's backup directory if it doesn't exist
        if (!is_dir($str_pathMonth)) {
            mkdir($str_pathMonth, 0777, true);
        }
    
        // Create the current month's backup directory if it doesn't exist
        if (!is_dir($str_pathDestination)) {
            mkdir($str_pathDestination, 0777, true);
        }
    
        /*
        // Delete the previous month's backup directory if it exists
        $previousBackupDir = $backupBaseDir . $date_monthPrevious . '/';
        if (is_dir($previousBackupDir)) {
            array_map('unlink', glob("$previousBackupDir/*.*"));
            rmdir($previousBackupDir);
        } 
        //*/       
    
        
        //CREATE DUMP FILE
        //$command = "mysqldump --host=$host --user=$user --password=$password --all-databases  > $str_pathDumpFile";
        $command="mysqldump --host=$host --user=$REMOTE_ADMINISTRATOR_USERNAME --password=$REMOTE_ADMINISTRATOR_PASSWORD --set-gtid-purged=OFF --column-statistics=OFF --all-databases  > ".$str_pathDumpFile;        
        $this->fn_varDump($command, "command", true);        
        system($command, $output);        
        //CREATE DUMP FILE
    
        //ZIP DUMP FILE
        $source=$str_pathDumpFile;        
        $destination=$str_pathDumpZip;
        $this->fn_zipArchive($source, $destination);
        //ZIP DUMP FILE    

        //COPY ZIP FILE
        $source=$str_pathDumpZip;
        $destination=$str_pathVopsysZip;
        copy($source, $destination);
        //COPY ZIP FILE

        //COPY ZIP FILE
        $source=$str_pathDumpZip;        
        unlink($source);
        //COPY ZIP FILE
        
        //COPY IN VOPSYS FOLDER, excluding .git        
        $this->fn_varDump($str_pathVopsys, "str_pathVopsys", true);        
        $this->fn_varDump($str_pathDestination, "str_pathDestination", true);        
        $this->fn_recursiveCopy($str_pathVopsys, $str_pathDestination);
        //COPY IN VOPSYS FOLDER, excluding .git
    
        //$this->fn_varDump($str_pathDestination, "ALL COMPLETE", true);        
    }

    function fn_recursiveCopy($src, $dst) {
        $iterator = new RecursiveDirectoryIterator($src, RecursiveDirectoryIterator::SKIP_DOTS);
        $iterator = new RecursiveIteratorIterator($iterator, RecursiveIteratorIterator::SELF_FIRST);
    
        foreach ($iterator as $file) {
            
            $str_baseName=$file->getBasename();
            $str_pathName=$file->getPathname();
            if(strpos($str_pathName, '.git')){
                continue;
            }            
            //$this->fn_varDump($str_baseName);                        
            $target = $dst . DIRECTORY_SEPARATOR . $iterator->getSubPathName();            
            //$this->fn_varDump("target: " . $target);                        
            
    
            if ($file->isDir()) {
                mkdir($target);
            } elseif ($file->isFile()) {
                copy($file, $target);
            }
        }
    }

    function fn_zipArchive($source, $destination) {

        
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