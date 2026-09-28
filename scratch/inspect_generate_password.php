<?php
$content = file_get_contents(__DIR__ . '/../client/lib/espo-main.js');

$pos = strpos($content, 'define("views/user/fields/generate-password"');
if ($pos !== false) {
    echo substr($content, $pos, 2500);
} else {
    echo "NOT FOUND";
}
