<?php
$content = file_get_contents(__DIR__ . '/../client/lib/espo-main.js');

function extractDefine($name, $content) {
    $pos = strpos($content, 'define("' . $name . '"');
    if ($pos === false) {
        $pos = strpos($content, "define('" . $name . "'");
    }
    if ($pos !== false) {
        return substr($content, $pos, 2500);
    }
    return "NOT FOUND";
}

echo "=== views/user/fields/password ===\n";
echo extractDefine('views/user/fields/password', $content) . "\n\n";

echo "=== views/modals/change-password ===\n";
echo extractDefine('views/modals/change-password', $content) . "\n\n";
