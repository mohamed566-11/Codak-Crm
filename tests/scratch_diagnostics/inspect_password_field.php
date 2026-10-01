<?php
$content = file_get_contents(__DIR__ . '/../client/lib/espo-main.js');
$pos = strpos($content, 'define("views/user/fields/password"');
echo substr($content, $pos, 4000);
