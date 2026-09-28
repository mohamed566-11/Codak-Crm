<?php
$content = file_get_contents(__DIR__ . '/../client/lib/espo-main.js');

preg_match_all('/define\(["\']res:templates\/fields\/password\/edit["\'][^;]+/', $content, $m);
if (empty($m[0])) {
    preg_match_all('/fields\/password\/edit[^}]+\}/', $content, $m);
}
print_r($m);
