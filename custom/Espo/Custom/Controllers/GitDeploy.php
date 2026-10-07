<?php

namespace Espo\Custom\Controllers;

use Espo\Core\Exceptions\Forbidden;
use Espo\Core\Exceptions\BadRequest;
use Espo\Core\Api\Request;
use Espo\Entities\User;
use Espo\Custom\Services\GitDeployService;

class GitDeploy
{
    public function __construct(
        private User $user,
        private GitDeployService $gitDeployService
    ) {}

    /**
     * Webhook endpoint for GitHub Push events (noAuth route)
     */
    public function postActionWebhook(Request $request): array
    {
        $payload = json_decode($request->getBody(), true) ?? [];
        $signature = $request->getHeader('X-Hub-Signature-256');

        return $this->gitDeployService->handleWebhook($payload, $signature);
    }

    /**
     * Action to execute a single upgrade step (gitPull, clearCache, rebuild, updateTimestamp)
     */
    public function postActionUpgradeStep(Request $request): array
    {
        if (!$this->user->isAdmin()) {
            throw new Forbidden("تنبيه: الترقية مقتصرة فقط على المديرين (Administrators).");
        }

        $data = json_decode($request->getBody(), true) ?? [];
        $step = $data['step'] ?? null;

        if (empty($step)) {
            throw new BadRequest("اسم الخطوة (step) مطلوب.");
        }

        return $this->gitDeployService->executeStep($step);
    }

    /**
     * Action to manually trigger a git fetch check
     */
    public function postActionCheckForUpdates(Request $request): array
    {
        if (!$this->user->isAdmin()) {
            throw new Forbidden("Access denied.");
        }

        return $this->gitDeployService->checkForUpdates();
    }
}
