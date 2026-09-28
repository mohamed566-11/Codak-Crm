<?php
$content = file_get_contents(__DIR__ . '/../client/lib/espo-main.js');

preg_match_all('/data-action=["\']change["\'][^>]+/i', $content, $m);
print_r($m[0]);

preg_match_all('/<input[^>]+name=["\']password["\'][^>]*>/i', $content, $m2);
print_r($m2[0]);
