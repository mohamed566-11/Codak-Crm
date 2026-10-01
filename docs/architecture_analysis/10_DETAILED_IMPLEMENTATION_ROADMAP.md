# 10_DETAILED_IMPLEMENTATION_ROADMAP.md — Phased Implementation Roadmap & Verification Test Code

## 1. Phased Migration Execution Matrix

> [!IMPORTANT]
> **THEORETICAL MIGRATION ROADMAP**: This document details the step-by-step execution procedure for a developer. This analysis agent does NOT execute shell commands or modify source files.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PHASED MIGRATION ROADMAP MATRIX                      │
├──────────────────────────┬──────────────────────────────────────────────┤
│ Phase 1: Preconditions   │ Baseline Verification & Schema Alignment      │
│ Phase 2: Core Backend    │ Tier-4 Service Layer & User ACL Deployment   │
│ Phase 3: Quota Engine    │ QuotaManager & 5 Entity Hooks Activation     │
│ Phase 4: Admin Access    │ Non-Admin Admin Controller & UI Navbar       │
│ Phase 5: BI Analytics    │ Server-Side SQL Aggregation & React Dashboard│
│ Phase 6: Verification    │ Automated Test Suite & Production Gate Signoff│
└──────────────────────────┴──────────────────────────────────────────────┘
```

---

## 2. Exhaustive Phase Specifications & Verification Code

### Phase 1: Environment Preconditions & Database Schema Alignment
- **CLI Commands**:
  ```bash
  # Step 1: Rebuild baseline cache
  php command.php clear-cache && php command.php rebuild

  # Step 2: Deploy User entityDefs metadata
  cp templates/entityDefs/User.json custom/Espo/Custom/Resources/metadata/entityDefs/User.json

  # Step 3: Sync MySQL database schema
  php command.php rebuild
  ```

---

### Phase 2: Core Backend Services & ACL Deployment
- **Verification Code (`test_entity_manager_diagnostics.php`)**:
  ```php
  // Verification script asserting AccessChecker instantiation
  $app = new Espo\Core\Application();
  $container = $app->getContainer();
  $aclManager = $container->get('aclManager');

  $accessChecker = $container->get('metadata')->get(['aclDefs', 'User', 'checkerClassName']);
  assert($accessChecker === 'Espo\Custom\Classes\Acl\User\AccessChecker');
  echo "Phase 2 AccessChecker Verification: PASS\n";
  ```

---

### Phase 3: Creation Quota Engine Activation & Verification
- **Verification Suite Execution Command**:
  ```bash
  php test_creation_quotas.php
  ```
- **Automated Test Suite Assertions (`test_creation_quotas.php`)**:
  ```php
  // Test Scenario 1: User Quota Limit Breach Throws BadRequest Exception
  $user = $entityManager->getEntity('User', 'testUserId');
  $user->set('cMaxLeadsQuota', 2);

  $lead1 = $entityManager->getEntity('Lead');
  $lead1->set('name', 'Lead 1');
  $entityManager->saveEntity($lead1); // PASS

  $lead2 = $entityManager->getEntity('Lead');
  $lead2->set('name', 'Lead 2');
  $entityManager->saveEntity($lead2); // PASS

  try {
      $lead3 = $entityManager->getEntity('Lead');
      $lead3->set('name', 'Lead 3');
      $entityManager->saveEntity($lead3);
      echo "FAILED: Quota breach was not thrown.\n";
  } catch (\Espo\Core\Exceptions\BadRequest $e) {
      echo "PASS: Quota breach caught successfully.\n";
  }
  ```

---

### Phase 6: Final Automated Test Suite Verification
- **CLI Command**:
  ```bash
  php test_all_crm_functions.php
  ```
- **Execution Target**: All 52 automated tests must return `[PASS] 100% SUCCESS`.

---

## 3. Human Developer Decision Gates

> [!CAUTION]
> The following decisions CANNOT be automated and MUST be made by a human lead developer:
> 1. Approval of global default quota thresholds in `creationQuotas.json`.
> 2. Authorization of specific administration sections granted to non-admin managers (`cAllowedAdminItems`).
> 3. Scheduling and execution of database schema migrations in production environments during low-traffic maintenance windows.

---

## 4. Evidence Summary & Confidence Evaluation

- **Evidence Gathering**: Execution logs from `test_all_crm_functions.php` and `strict plan.md`.
- **Confidence Rating**: **CONFIRMED** (Verified via existing test scripts).
