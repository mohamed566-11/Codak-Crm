<?php

namespace Espo\Custom\Select\AccessControl;

use Espo\Core\Select\AccessControl\FilterResolver;

class AllFilterResolver implements FilterResolver
{
    public function resolve(): ?string
    {
        return 'all';
    }
}
