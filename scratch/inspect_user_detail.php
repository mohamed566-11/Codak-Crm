<?php
$content = file_get_contents(__DIR__ . '/../client/lib/espo-main.js');

function extractDefine($name, $content) {
    $pos = strpos($content, 'define("' . $name . '"');
    if ($pos === false) {
        $pos = strpos($content, "define('" . $name . "'");
    }
    if ($pos !== false) {
        return substr($content, $pos, 3500);
    }
    return "NOT FOUND";
}

echo "=== views/user/detail ===\n";
echo extractDefine('views/user/detail', $content) . "\n\n";

echo "=== views/user/record/detail ===\n";
echo extractDefine('views/user/record/detail', $content) . "\n\n";
