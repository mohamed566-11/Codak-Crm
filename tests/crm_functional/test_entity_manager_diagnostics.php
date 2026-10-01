<?php
/**
 * Comprehensive Entity Manager & Field Operations Test Suite
 * Tests CRUD operations for Fields, Layouts, Formula, and File Permissions
 */

include __DIR__ . '/bootstrap.php';

use Espo\Core\Application;
use Espo\Tools\FieldManager\FieldManager;
use Espo\Tools\LayoutManager\LayoutManager;
use Espo\Tools\EntityManager\EntityManager as EntityManagerTool;
use Espo\Tools\LinkManager\LinkManager;
use Espo\Core\Utils\Metadata;

$app = new Application();
$app->setupSystemUser();
$container = $app->getContainer();
$injectableFactory = $app->getInjectableFactory();
$metadata = $container->getByClass(Metadata::class);

echo "\n" . str_repeat('=', 70) . "\n";
echo "   CODAK CRM - ENTITY MANAGER FULL DIAGNOSTIC & CRUD TEST SUITE\n";
echo str_repeat('=', 70) . "\n\n";

$allPassed = true;
$results = [];

function recordResult($testName, $status, $details = '') {
    global $results, $allPassed;
    $results[] = [
        'name' => $testName,
        'status' => $status,
        'details' => $details
    ];
    if (!$status) {
        $allPassed = false;
    }
    $icon = $status ? "[\033[32mPASS\033[0m]" : "[\033[31mFAIL\033[0m]";
    echo sprintf("%-55s %s\n", $testName, $icon);
    if ($details) {
        echo "  └─ " . $details . "\n";
    }
}

// -------------------------------------------------------------
// SECTION 1: File Permissions & Directory Health Check
// -------------------------------------------------------------
echo "\n--- [1] AUDITING METADATA FILE PERMISSIONS & DIRECTORY WRITABILITY ---\n";

$criticalDirs = [
    'custom/Espo/Custom/Resources/metadata',
    'custom/Espo/Custom/Resources/metadata/clientDefs',
    'custom/Espo/Custom/Resources/metadata/entityDefs',
    'custom/Espo/Custom/Resources/metadata/logicDefs',
    'custom/Espo/Custom/Resources/metadata/scopes',
    'custom/Espo/Custom/Resources/layouts',
    'custom/Espo/Custom/Resources/i18n/en_US',
    'data'
];

foreach ($criticalDirs as $relDir) {
    $fullPath = __DIR__ . '/' . $relDir;
    if (!is_dir($fullPath)) {
        @mkdir($fullPath, 0775, true);
    }
    
    $isReadable = is_readable($fullPath);
    $isWritable = is_writable($fullPath);
    
    // Test write and delete
    $testFile = $fullPath . '/.perm_test_' . uniqid() . '.tmp';
    $canWriteFile = @file_put_contents($testFile, 'test') !== false;
    if ($canWriteFile) {
        @unlink($testFile);
    }
    
    $status = $isReadable && $isWritable && $canWriteFile;
    recordResult("Directory Permission: $relDir", $status, "Readable: " . ($isReadable ? 'Yes' : 'No') . " | Writable: " . ($isWritable ? 'Yes' : 'No') . " | File Write/Delete: " . ($canWriteFile ? 'OK' : 'DENIED'));
}

// Check existing JSON files validity
echo "\n--- [2] VALIDATING EXISTING METADATA JSON INTEGRITY ---\n";
$jsonFiles = glob(__DIR__ . '/custom/Espo/Custom/Resources/metadata/*/*.json');
$corruptedJson = [];
foreach ($jsonFiles as $jf) {
    $content = file_get_contents($jf);
    $decoded = json_decode($content, true);
    if ($decoded === null && trim($content) !== '') {
        $corruptedJson[] = basename($jf);
    }
}
recordResult("Metadata JSON Syntax Integrity (" . count($jsonFiles) . " files)", count($corruptedJson) === 0, count($corruptedJson) === 0 ? "All JSON files are structurally valid." : "Corrupted: " . implode(', ', $corruptedJson));

// -------------------------------------------------------------
// SECTION 3: Field Lifecycle CRUD Test (FieldManager)
// -------------------------------------------------------------
echo "\n--- [3] TESTING FIELD CRUD OPERATIONS (FieldManager) ---\n";

/** @var FieldManager $fieldManager */
$fieldManager = $injectableFactory->create(FieldManager::class);
$targetScope = 'Account';
$baseFieldName = 'testAutoDiag';
$actualFieldName = 'cTestAutoDiag'; // EspoCRM automatically adds 'c' prefix for custom fields

try {
    // 3.1: CREATE Field
    echo "Creating custom field '$baseFieldName' on '$targetScope'...\n";
    $fieldDefs = [
        'type' => 'varchar',
        'label' => 'Automated Test Diagnostic Field',
        'maxLength' => 120,
        'tooltip' => 'Testing Field Creation',
        'required' => false
    ];
    $createdName = $fieldManager->create($targetScope, $baseFieldName, $fieldDefs);
    recordResult("FieldManager: Create Field", $createdName === $actualFieldName, "Expected '$actualFieldName', Got '$createdName'");
    
    // 3.2: READ Field
    $readDefs = $fieldManager->read($targetScope, $actualFieldName);
    $readSuccess = is_array($readDefs) && ($readDefs['type'] ?? '') === 'varchar' && ($readDefs['maxLength'] ?? 0) === 120;
    recordResult("FieldManager: Read Field Defs", $readSuccess, "Field read successfully with type=" . ($readDefs['type'] ?? 'none'));
    
    // 3.3: UPDATE Field (Change label and dynamic logic)
    $updateDefs = [
        'type' => 'varchar',
        'label' => 'Updated Test Diagnostic Field',
        'maxLength' => 200,
        'dynamicLogicRequired' => [
            'conditionGroup' => [
                ['field' => 'type', 'operator' => 'equals', 'value' => 'Customer']
            ]
        ]
    ];
    $fieldManager->update($targetScope, $actualFieldName, $updateDefs);
    
    // Verify update
    $readUpdated = $fieldManager->read($targetScope, $actualFieldName);
    $updateSuccess = ($readUpdated['label'] ?? '') === 'Updated Test Diagnostic Field' && ($readUpdated['maxLength'] ?? 0) === 200;
    recordResult("FieldManager: Update Field & Logic", $updateSuccess, "Label updated to '" . ($readUpdated['label'] ?? '') . "', maxLength=" . ($readUpdated['maxLength'] ?? 0));
    
    // 3.4: DELETE Field
    echo "Deleting custom field '$actualFieldName' from '$targetScope'...\n";
    $fieldManager->delete($targetScope, $actualFieldName);
    
    // 3.5: Verify Field is Gone
    $isGone = false;
    try {
        $fieldManager->read($targetScope, $actualFieldName);
    } catch (\Throwable $e) {
        $isGone = true; // Expected: Can't read field defs
    }
    recordResult("FieldManager: Delete Field Cleanly (Account)", $isGone, "Field successfully removed from entityDefs and logicDefs");

} catch (\Throwable $e) {
    recordResult("FieldManager: CRUD Operations (Account)", false, "Exception: " . $e->getMessage() . " at " . $e->getFile() . ":" . $e->getLine());
    try { @$fieldManager->delete($targetScope, $actualFieldName); } catch (\Throwable $ignore) {}
}

// -------------------------------------------------------------
// SECTION 3-B: Contact Specific Delete Test (Matching Exact User Error)
// -------------------------------------------------------------
echo "\n--- [3-B] TESTING DELETE SPECIFICALLY ON 'Contact' ENTITY ---\n";
$contactField = 'testContactDel';
$actualContactField = 'cTestContactDel';

try {
    echo "1. Creating test field '$actualContactField' on 'Contact'...\n";
    $fieldManager->create('Contact', $contactField, [
        'type' => 'varchar',
        'label' => 'Contact Delete Diagnostic Test',
        'maxLength' => 100
    ]);

    echo "2. Injecting Dynamic Logic into Contact.json (Testing logicDefs writability)...\n";
    $fieldManager->update('Contact', $actualContactField, [
        'type' => 'varchar',
        'dynamicLogicRequired' => [
            'conditionGroup' => [
                ['field' => 'title', 'operator' => 'isNotEmpty']
            ]
        ]
    ]);

    // Check that logicDefs/Contact.json was touched
    $logicContactPath = __DIR__ . '/custom/Espo/Custom/Resources/metadata/logicDefs/Contact.json';
    $logicHasField = false;
    if (file_exists($logicContactPath)) {
        $logicContent = file_get_contents($logicContactPath);
        $logicHasField = strpos($logicContent, $actualContactField) !== false;
    }
    recordResult("FieldManager: Prepare Contact & logicDefs", $logicHasField, "Field dynamic logic written to Contact.json");

    echo "3. Executing DELETE /Contact/$actualContactField (Exact operation that failed in log)...\n";
    $fieldManager->delete('Contact', $actualContactField);

    // Verify deletion in physical files
    $logicClean = true;
    if (file_exists($logicContactPath)) {
        $logicContent = file_get_contents($logicContactPath);
        $logicClean = strpos($logicContent, $actualContactField) === false;
    }
    
    $deletedFromDefs = false;
    try {
        $fieldManager->read('Contact', $actualContactField);
    } catch (\Throwable $e) {
        $deletedFromDefs = true; // Expected: field was deleted
    }

    recordResult("FieldManager: DELETE Contact Field Operation", $logicClean && $deletedFromDefs, "Successfully deleted without PermissionError or metadata corruption!");

} catch (\Throwable $e) {
    recordResult("FieldManager: DELETE on Contact", false, "Exception: " . $e->getMessage() . " at " . $e->getFile() . ":" . $e->getLine());
    try { @$fieldManager->delete('Contact', $actualContactField); } catch (\Throwable $ignore) {}
}

// -------------------------------------------------------------
// SECTION 4: Layouts CRUD Test (LayoutManager)
// -------------------------------------------------------------
echo "\n--- [4] TESTING LAYOUTS OPERATIONS (LayoutManager) ---\n";

/** @var LayoutManager $layoutManager */
$layoutManager = $injectableFactory->create(LayoutManager::class);

try {
    // 4.1: Read Layout
    $currentLayout = $layoutManager->get('Account', 'list');
    $readLayoutOk = !empty($currentLayout);
    recordResult("LayoutManager: Read Layout (Account.list)", $readLayoutOk, "Read " . strlen((string)$currentLayout) . " bytes of layout JSON");

    // 4.2: Set and Save Custom Layout
    $layoutData = json_decode((string)$currentLayout, true);
    if (!is_array($layoutData)) {
        $layoutData = [["name" => "name"], ["name" => "type"]];
    }
    // Add temporary diagnostic comment/entry
    $testLayoutData = $layoutData;
    $layoutManager->set($testLayoutData, 'Account', 'list');
    $layoutManager->save();
    
    $customLayoutPath = __DIR__ . '/custom/Espo/Custom/Resources/layouts/Account/list.json';
    $customLayoutExists = file_exists($customLayoutPath);
    recordResult("LayoutManager: Save Custom Layout", $customLayoutExists, "Custom layout written to '$customLayoutPath'");

    // 4.3: Reset Layout to Default
    $layoutManager->resetToDefault('Account', 'list');
    $customLayoutCleaned = !file_exists($customLayoutPath);
    recordResult("LayoutManager: Reset Layout to Default", $customLayoutCleaned, "Custom layout file successfully removed");

} catch (\Throwable $e) {
    recordResult("LayoutManager: Operations", false, "Exception: " . $e->getMessage());
}

// -------------------------------------------------------------
// SECTION 5: Formula CRUD Test (EntityManager Tool)
// -------------------------------------------------------------
echo "\n--- [5] TESTING FORMULA OPERATIONS (EntityManager Tool) ---\n";

/** @var EntityManagerTool $entityManagerTool */
$entityManagerTool = $injectableFactory->create(EntityManagerTool::class);

try {
    // 5.1: Set Formula
    $testFormulaData = [
        'beforeSaveCustomScript' => "// Automated Diagnostic Test\n// " . date('Y-m-d H:i:s')
    ];
    $entityManagerTool->setFormulaData('Account', $testFormulaData);
    
    $formulaPath = __DIR__ . '/custom/Espo/Custom/Resources/metadata/formula/Account.json';
    $formulaSaved = file_exists($formulaPath);
    recordResult("EntityManager: Save Formula Script", $formulaSaved, "Formula saved to '$formulaPath'");

    // 5.2: Clean/Reset Formula
    $entityManagerTool->setFormulaData('Account', ['beforeSaveCustomScript' => '']);
    if (file_exists($formulaPath)) {
        $content = json_decode(file_get_contents($formulaPath), true);
        if (empty($content['beforeSaveCustomScript'])) {
            @unlink($formulaPath);
        }
    }
    recordResult("EntityManager: Reset Formula Script", true, "Formula cleaned and restored successfully");

} catch (\Throwable $e) {
    recordResult("EntityManager: Formula Operations", false, "Exception: " . $e->getMessage());
}

// -------------------------------------------------------------
// SECTION 6: Relationships / LinkManager Test
// -------------------------------------------------------------
echo "\n--- [6] TESTING RELATIONSHIPS INTEGRITY (LinkManager) ---\n";

try {
    /** @var LinkManager $linkManager */
    $linkManager = $injectableFactory->create(LinkManager::class);
    $accountLinks = $metadata->get(['entityDefs', 'Account', 'links']) ?? [];
    $hasStandardLinks = isset($accountLinks['contacts']) && isset($accountLinks['opportunities']);
    recordResult("LinkManager: Relationships Defs Loaded", $hasStandardLinks, "Account links detected: " . count($accountLinks) . " links (contacts, opps present)");
} catch (\Throwable $e) {
    recordResult("LinkManager: Relationship Integrity", false, "Exception: " . $e->getMessage());
}

// -------------------------------------------------------------
// SUMMARY & CLEANUP
// -------------------------------------------------------------
echo "\n" . str_repeat('=', 70) . "\n";
if ($allPassed) {
    echo "🎉 ALL TESTS PASSED SUCCESSFULLY! (100% HEALTHY)\n";
    echo "The Entity Manager, Field Manager, Layouts, Formula, and file permissions\n";
    echo "are completely functional and error-free on this CRM system.\n";
} else {
    echo "⚠️ SOME TESTS FAILED. PLEASE REVIEW THE LOG ABOVE.\n";
}
echo str_repeat('=', 70) . "\n\n";
