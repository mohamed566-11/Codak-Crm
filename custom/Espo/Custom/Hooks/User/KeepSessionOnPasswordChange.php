<?php

namespace Espo\Custom\Hooks\User;

use Espo\Core\Hook\Hook\AfterSave;
use Espo\Entities\AuthToken;
use Espo\Entities\User;
use Espo\ORM\Entity;
use Espo\ORM\EntityManager;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * Ensures active session AuthToken passwordVersion is synchronized when a user changes their password,
 * preventing auto-logout.
 *
 * @implements AfterSave<User>
 */
class KeepSessionOnPasswordChange implements AfterSave
{
    public function __construct(
        private EntityManager $entityManager,
        private User $currentUser,
    ) {}

    public function afterSave(Entity $entity, SaveOptions $options): void
    {
        if (!$entity instanceof User) {
            return;
        }

        if (!$entity->isAttributeChanged(User::FIELD_PASSWORD)) {
            return;
        }

        $newPasswordVersion = $entity->get(User::FIELD_PASSWORD_VERSION);
        if ($newPasswordVersion === null) {
            return;
        }

        $targetUserId = $entity->getId();
        $currentUserId = $this->currentUser->getId();

        // If the logged-in user changed their OWN password
        if ($targetUserId === $currentUserId) {
            /** @var AuthToken[] $tokens */
            $tokens = $this->entityManager
                ->getRDBRepositoryByClass(AuthToken::class)
                ->where([
                    'userId' => $targetUserId,
                    'isActive' => true,
                ])
                ->find();

            foreach ($tokens as $token) {
                $token->set('passwordVersion', (int) $newPasswordVersion);
                $this->entityManager->saveEntity($token);
            }
        }
    }
}
