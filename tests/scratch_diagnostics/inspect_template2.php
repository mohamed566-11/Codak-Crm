<?php
$content = file_get_contents(__DIR__ . '/../client/lib/espo-main.js');

$pos = strpos($content, 'fields/password/edit');
while ($pos !== false) {
    echo "POS $pos:\n" . substr($content, max(0, $pos - 100), 400) . "\n-------------------\n";
    $pos = strpos($content, 'fields/password/edit', $pos + 1);
}
