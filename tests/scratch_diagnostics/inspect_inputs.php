<?php
$content = file_get_contents(__DIR__ . '/../client/lib/espo-main.js');

preg_match_all('/<input[^>]+type=["\']password["\'][^>]*>/i', $content, $m);
print_r($m[0]);
