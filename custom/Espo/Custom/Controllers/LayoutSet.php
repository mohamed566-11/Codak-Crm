<?php

namespace Espo\Custom\Controllers;

use Espo\Core\Controllers\Record;

class LayoutSet extends Record
{
    protected function checkAccess(): bool
    {
        return true;
    }
}
