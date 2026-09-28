<?php
$content = file_get_contents(__DIR__ . '/../client/lib/espo-main.js');

$pos = strpos($content, 'fields/password/edit');
while ($pos !== false) {
    $snippet = substr($content, max(0, $pos - 200), 1000);
    if (strpos($snippet, 'input') !== false || strpos($snippet, 'change') !== false || strpos($snippet, 'template') !== false) {
        echo "SNIPPET:\n" . $snippet . "\n=========================================\n";
    }
    $pos = strpos($content, 'fields/password/edit', $pos + 1);
}
