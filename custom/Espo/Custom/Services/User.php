<?php

namespace Espo\Custom\Services;

use Espo\Core\Exceptions\Forbidden;
use Espo\Core\Exceptions\BadRequest;
use Espo\Core\Record\CreateParams;
use Espo\Core\Record\CreateResult;
use Espo\Core\Record\UpdateParams;
use Espo\Core\Record\UpdateResult;
use Espo\Entities\User as UserEntity;
use Espo\Services\User as CoreUserService;
use stdClass;

/**
 * Allows non-admin users to set passwords during user creation
 * and update passwords for themselves or users they created.
 */
class User extends CoreUserService
{
    public function filterCreateInput(stdClass $data): void
    {
        $user = $this->user;
        $passwordToRestore = null;
        $passwordConfirmToRestore = null;

        if (
            !$user->isAdmin() &&
            property_exists($data, 'password') &&
            !empty($data->password)
        ) {
            $passwordToRestore = $data->password;
            $passwordConfirmToRestore = $data->passwordConfirm ?? null;
        }

        parent::filterCreateInput($data);

        if ($passwordToRestore !== null) {
            $data->password = $passwordToRestore;
            if ($passwordConfirmToRestore !== null) {
                $data->passwordConfirm = $passwordConfirmToRestore;
            }
        }
    }

    public function create(stdClass $data, CreateParams $params = new CreateParams()): CreateResult
    {
        $user = $this->user;

        if (
            !$user->isAdmin() &&
            property_exists($data, 'password') &&
            !empty($data->password)
        ) {
            $rawPassword = $data->password;
            $rawConfirm = $data->passwordConfirm ?? null;

            if ($rawConfirm !== null && $rawConfirm !== $rawPassword) {
                throw new BadRequest("Password confirmation does not match.");
            }
        }

        return parent::create($data, $params);
    }

    public function filterUpdateInput(stdClass $data): void
    {
        $user = $this->user;
        $passwordToRestore = null;
        $passwordConfirmToRestore = null;

        if (
            !$user->isAdmin() &&
            property_exists($data, 'password') &&
            !empty($data->password)
        ) {
            $passwordToRestore = $data->password;
            $passwordConfirmToRestore = $data->passwordConfirm ?? null;
        }

        parent::filterUpdateInput($data);

        if ($passwordToRestore !== null) {
            $data->password = $passwordToRestore;
            if ($passwordConfirmToRestore !== null) {
                $data->passwordConfirm = $passwordConfirmToRestore;
            }
        }
    }

    public function update(string $id, stdClass $data, UpdateParams $params = new UpdateParams()): UpdateResult
    {
        $user = $this->user;

        if (
            !$user->isAdmin() &&
            property_exists($data, 'password') &&
            !empty($data->password)
        ) {
            $rawPassword = $data->password;
            $rawConfirm = $data->passwordConfirm ?? null;

            /** @var ?UserEntity $targetUser */
            $targetUser = $this->entityManager->getEntityById(UserEntity::ENTITY_TYPE, $id);

            if (!$targetUser) {
                throw new Forbidden("You do not have permission to change this user's password.");
            }

            $isSelf = ($targetUser->getId() === $user->getId());
            $isCreatedByCurrentUser = ($targetUser->get('createdById') === $user->getId());

            if (
                $targetUser->isAdmin() ||
                $targetUser->isSuperAdmin() ||
                $targetUser->isSystem() ||
                $targetUser->isApi()
            ) {
                throw new Forbidden("Non-admin users cannot change this user's password.");
            }

            if (!$isSelf && !$isCreatedByCurrentUser) {
                throw new Forbidden("You do not have permission to change this user's password.");
            }

            if ($rawConfirm === null || $rawConfirm !== $rawPassword) {
                throw new BadRequest("Password confirmation does not match.");
            }

            return parent::update($id, (object) [
                'password' => $rawPassword,
            ], $params);
        }

        return parent::update($id, $data, $params);
    }
}

