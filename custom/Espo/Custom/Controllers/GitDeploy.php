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
        $rawBody = $request->getBodyContents() ?? '';
        $headers = [
            'signature' => $request->getHeader('X-Hub-Signature-256'),
            'event' => $request->getHeader('X-GitHub-Event'),
        ];

        return $this->gitDeployService->handleWebhook($rawBody, $headers);
    }

    /**
     * Action to execute a single upgrade step (gitPull, clearCache, rebuild, updateTimestamp)
     */
    public function postActionUpgradeStep(Request $request): array
    {
        if (!$this->user->isAdmin()) {
            throw new Forbidden("Access denied: Upgrade operations are restricted to Administrators.");
        }

        $rawBody = $request->getBodyContents() ?? '';
        $data = json_decode($rawBody, true) ?? [];
        $step = $data['step'] ?? null;

        if (empty($step) || !is_string($step)) {
            throw new BadRequest("Parameter 'step' is required.");
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
