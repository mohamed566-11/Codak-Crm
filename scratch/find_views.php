<?php
$content = file_get_contents(__DIR__ . '/../client/lib/espo-main.js');
preg_match_all('/define\(["\']([^"\']+)["\']/', $content, $m);
$results = array_filter($m[1], function($v){ 
    return strpos($v, 'password') !== false || strpos($v, 'user') !== false || strpos($v, 'field') !== false; 
});
print_r($results);
