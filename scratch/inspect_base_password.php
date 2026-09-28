<?php
$content = file_get_contents(__DIR__ . '/../client/lib/espo-main.js');
$pos = strpos($content, 'define("views/fields/password"');
if ($pos === false) {
    // try searching for views/fields/password in espo-main.js or espo.js
    preg_match_all('/define\("views\/fields\/password"[^;]+/', $content, $m);
    print_r($m);
} else {
    echo substr($content, $pos, 4000);
}
