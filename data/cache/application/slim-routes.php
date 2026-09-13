<?php return array (
  0 => 
  array (
    'GET' => 
    array (
      '/EspoCRM-10.0.3/api/v1/Activities/upcoming' => 'route3',
      '/EspoCRM-10.0.3/api/v1/Activities' => 'route4',
      '/EspoCRM-10.0.3/api/v1/Timeline' => 'route5',
      '/EspoCRM-10.0.3/api/v1/Timeline/busyRanges' => 'route6',
      '/EspoCRM-10.0.3/api/v1/' => 'route15',
      '/EspoCRM-10.0.3/api/v1/App/user' => 'route16',
      '/EspoCRM-10.0.3/api/v1/App/about' => 'route18',
      '/EspoCRM-10.0.3/api/v1/App/appParams' => 'route19',
      '/EspoCRM-10.0.3/api/v1/Metadata' => 'route20',
      '/EspoCRM-10.0.3/api/v1/I18n' => 'route21',
      '/EspoCRM-10.0.3/api/v1/Settings' => 'route22',
      '/EspoCRM-10.0.3/api/v1/Stream' => 'route25',
      '/EspoCRM-10.0.3/api/v1/GlobalStream' => 'route26',
      '/EspoCRM-10.0.3/api/v1/GlobalSearch' => 'route27',
      '/EspoCRM-10.0.3/api/v1/Admin/jobs' => 'route39',
      '/EspoCRM-10.0.3/api/v1/CurrencyRate' => 'route45',
      '/EspoCRM-10.0.3/api/v1/Notification/group' => 'route70',
      '/EspoCRM-10.0.3/api/v1/Email/inbox/notReadCounts' => 'route84',
      '/EspoCRM-10.0.3/api/v1/Email/insertFieldData' => 'route85',
      '/EspoCRM-10.0.3/api/v1/EmailAddress/search' => 'route87',
      '/EspoCRM-10.0.3/api/v1/Oidc/authorizationData' => 'route99',
      '/EspoCRM-10.0.3/api/v1/OpenApi' => 'route103',
    ),
    'POST' => 
    array (
      '/EspoCRM-10.0.3/api/v1/App/destroyAuthToken' => 'route17',
      '/EspoCRM-10.0.3/api/v1/Admin/rebuild' => 'route37',
      '/EspoCRM-10.0.3/api/v1/Admin/clearCache' => 'route38',
      '/EspoCRM-10.0.3/api/v1/Action' => 'route47',
      '/EspoCRM-10.0.3/api/v1/MassAction' => 'route48',
      '/EspoCRM-10.0.3/api/v1/Export' => 'route51',
      '/EspoCRM-10.0.3/api/v1/Import' => 'route54',
      '/EspoCRM-10.0.3/api/v1/Import/file' => 'route55',
      '/EspoCRM-10.0.3/api/v1/Attachment/fromImageUrl' => 'route64',
      '/EspoCRM-10.0.3/api/v1/Email/importEml' => 'route75',
      '/EspoCRM-10.0.3/api/v1/Email/sendTest' => 'route76',
      '/EspoCRM-10.0.3/api/v1/Email/inbox/read' => 'route77',
      '/EspoCRM-10.0.3/api/v1/Email/inbox/important' => 'route79',
      '/EspoCRM-10.0.3/api/v1/Email/inbox/inTrash' => 'route81',
      '/EspoCRM-10.0.3/api/v1/UserSecurity/apiKey/generate' => 'route90',
      '/EspoCRM-10.0.3/api/v1/UserSecurity/password/recovery' => 'route92',
      '/EspoCRM-10.0.3/api/v1/UserSecurity/password/generate' => 'route93',
      '/EspoCRM-10.0.3/api/v1/User/passwordChangeRequest' => 'route94',
      '/EspoCRM-10.0.3/api/v1/User/changePasswordByRequest' => 'route95',
      '/EspoCRM-10.0.3/api/v1/Oidc/backchannelLogout' => 'route100',
    ),
    'PATCH' => 
    array (
      '/EspoCRM-10.0.3/api/v1/Settings' => 'route23',
    ),
    'PUT' => 
    array (
      '/EspoCRM-10.0.3/api/v1/Settings' => 'route24',
      '/EspoCRM-10.0.3/api/v1/CurrencyRate' => 'route46',
      '/EspoCRM-10.0.3/api/v1/Kanban/order' => 'route60',
      '/EspoCRM-10.0.3/api/v1/UserSecurity/password' => 'route91',
    ),
    'DELETE' => 
    array (
      '/EspoCRM-10.0.3/api/v1/Email/inbox/read' => 'route78',
      '/EspoCRM-10.0.3/api/v1/Email/inbox/important' => 'route80',
      '/EspoCRM-10.0.3/api/v1/Email/inbox/inTrash' => 'route82',
    ),
  ),
  1 => 
  array (
    'GET' => 
    array (
      0 => 
      array (
        'regex' => '~^(?|/EspoCRM\\-10\\.0\\.3/api/v1/Activities/([^/]+)/([^/]+)/composeEmailAddressList|/EspoCRM\\-10\\.0\\.3/api/v1/Activities/([^/]+)/([^/]+)/([^/]+)|/EspoCRM\\-10\\.0\\.3/api/v1/Activities/([^/]+)/([^/]+)/([^/]+)/list/([^/]+)|/EspoCRM\\-10\\.0\\.3/api/v1/Meeting/([^/]+)/attendees()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Call/([^/]+)/attendees()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/TargetList/([^/]+)/optedOut()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/action/([^/]+)()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/layout/([^/]+)()()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Admin/fieldManager/([^/]+)/([^/]+)()()()()()()()())$~',
        'routeMap' => 
        array (
          3 => 
          array (
            0 => 'route0',
            1 => 
            array (
              'parentType' => 'parentType',
              'id' => 'id',
            ),
          ),
          4 => 
          array (
            0 => 'route1',
            1 => 
            array (
              'parentType' => 'parentType',
              'id' => 'id',
              'type' => 'type',
            ),
          ),
          5 => 
          array (
            0 => 'route2',
            1 => 
            array (
              'parentType' => 'parentType',
              'id' => 'id',
              'type' => 'type',
              'targetType' => 'targetType',
            ),
          ),
          6 => 
          array (
            0 => 'route7',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          7 => 
          array (
            0 => 'route8',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          8 => 
          array (
            0 => 'route10',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          9 => 
          array (
            0 => 'route33',
            1 => 
            array (
              'controller' => 'controller',
              'action' => 'action',
            ),
          ),
          10 => 
          array (
            0 => 'route34',
            1 => 
            array (
              'controller' => 'controller',
              'name' => 'name',
            ),
          ),
          11 => 
          array (
            0 => 'route40',
            1 => 
            array (
              'scope' => 'scope',
              'name' => 'name',
            ),
          ),
        ),
      ),
      1 => 
      array (
        'regex' => '~^(?|/EspoCRM\\-10\\.0\\.3/api/v1/MassAction/([^/]+)/status|/EspoCRM\\-10\\.0\\.3/api/v1/Export/([^/]+)/status()|/EspoCRM\\-10\\.0\\.3/api/v1/Kanban/([^/]+)()()|/EspoCRM\\-10\\.0\\.3/api/v1/Attachment/file/([^/]+)()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Note/([^/]+)/reactors/([^/]+)()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Notification/([^/]+)/group()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/User/([^/]+)/stream/own()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/User/([^/]+)/acl()()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)()()()()()()())$~',
        'routeMap' => 
        array (
          2 => 
          array (
            0 => 'route49',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          3 => 
          array (
            0 => 'route52',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          4 => 
          array (
            0 => 'route61',
            1 => 
            array (
              'entityType' => 'entityType',
            ),
          ),
          5 => 
          array (
            0 => 'route62',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          6 => 
          array (
            0 => 'route68',
            1 => 
            array (
              'id' => 'id',
              'type' => 'type',
            ),
          ),
          7 => 
          array (
            0 => 'route69',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          8 => 
          array (
            0 => 'route88',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          9 => 
          array (
            0 => 'route89',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          10 => 
          array (
            0 => 'route104',
            1 => 
            array (
              'controller' => 'controller',
              'id' => 'id',
            ),
          ),
        ),
      ),
      2 => 
      array (
        'regex' => '~^(?|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/followers|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/stream()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/posts()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/updateStream()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/streamAttachments()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/usersAccess()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/([^/]+)()()()()())$~',
        'routeMap' => 
        array (
          2 => 
          array (
            0 => 'route105',
            1 => 
            array (
              'controller' => 'controller',
            ),
          ),
          3 => 
          array (
            0 => 'route110',
            1 => 
            array (
              'entityType' => 'entityType',
              'id' => 'id',
            ),
          ),
          4 => 
          array (
            0 => 'route113',
            1 => 
            array (
              'controller' => 'controller',
              'id' => 'id',
            ),
          ),
          5 => 
          array (
            0 => 'route114',
            1 => 
            array (
              'controller' => 'controller',
              'id' => 'id',
            ),
          ),
          6 => 
          array (
            0 => 'route115',
            1 => 
            array (
              'controller' => 'controller',
              'id' => 'id',
            ),
          ),
          7 => 
          array (
            0 => 'route118',
            1 => 
            array (
              'entityType' => 'entityType',
              'id' => 'id',
            ),
          ),
          8 => 
          array (
            0 => 'route123',
            1 => 
            array (
              'entityType' => 'entityType',
              'id' => 'id',
            ),
          ),
          9 => 
          array (
            0 => 'route124',
            1 => 
            array (
              'controller' => 'controller',
              'id' => 'id',
              'link' => 'link',
            ),
          ),
        ),
      ),
    ),
    'POST' => 
    array (
      0 => 
      array (
        'regex' => '~^(?|/EspoCRM\\-10\\.0\\.3/api/v1/Campaign/([^/]+)/generateMailMerge|/EspoCRM\\-10\\.0\\.3/api/v1/Campaign/unsubscribe/([^/]+)()|/EspoCRM\\-10\\.0\\.3/api/v1/Campaign/unsubscribe/([^/]+)/([^/]+)()|/EspoCRM\\-10\\.0\\.3/api/v1/LeadCapture/form/([^/]+)()()()|/EspoCRM\\-10\\.0\\.3/api/v1/LeadCapture/([^/]+)()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/action/([^/]+)()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Admin/fieldManager/([^/]+)()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/MassAction/([^/]+)/subscribe()()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Export/([^/]+)/subscribe()()()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Import/([^/]+)/revert()()()()()()()()())$~',
        'routeMap' => 
        array (
          2 => 
          array (
            0 => 'route9',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          3 => 
          array (
            0 => 'route11',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          4 => 
          array (
            0 => 'route13',
            1 => 
            array (
              'emailAddress' => 'emailAddress',
              'hash' => 'hash',
            ),
          ),
          5 => 
          array (
            0 => 'route28',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          6 => 
          array (
            0 => 'route29',
            1 => 
            array (
              'apiKey' => 'apiKey',
            ),
          ),
          7 => 
          array (
            0 => 'route31',
            1 => 
            array (
              'controller' => 'controller',
              'action' => 'action',
            ),
          ),
          8 => 
          array (
            0 => 'route41',
            1 => 
            array (
              'scope' => 'scope',
            ),
          ),
          9 => 
          array (
            0 => 'route50',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          10 => 
          array (
            0 => 'route53',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          11 => 
          array (
            0 => 'route56',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
        ),
      ),
      1 => 
      array (
        'regex' => '~^(?|/EspoCRM\\-10\\.0\\.3/api/v1/Import/([^/]+)/removeDuplicates|/EspoCRM\\-10\\.0\\.3/api/v1/Import/([^/]+)/unmarkDuplicates()|/EspoCRM\\-10\\.0\\.3/api/v1/Import/([^/]+)/exportErrors()()|/EspoCRM\\-10\\.0\\.3/api/v1/Attachment/chunk/([^/]+)()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Attachment/copy/([^/]+)()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Note/([^/]+)/myReactions/([^/]+)()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Notification/group/([^/]+)/markRead()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/EmailTemplate/([^/]+)/prepare()()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Email/([^/]+)/attachments/copy()()()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Email/inbox/folders/([^/]+)()()()()()()()()())$~',
        'routeMap' => 
        array (
          2 => 
          array (
            0 => 'route57',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          3 => 
          array (
            0 => 'route58',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          4 => 
          array (
            0 => 'route59',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          5 => 
          array (
            0 => 'route63',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          6 => 
          array (
            0 => 'route65',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          7 => 
          array (
            0 => 'route66',
            1 => 
            array (
              'id' => 'id',
              'type' => 'type',
            ),
          ),
          8 => 
          array (
            0 => 'route72',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          9 => 
          array (
            0 => 'route73',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          10 => 
          array (
            0 => 'route74',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          11 => 
          array (
            0 => 'route83',
            1 => 
            array (
              'folderId' => 'folderId',
            ),
          ),
        ),
      ),
      2 => 
      array (
        'regex' => '~^(?|/EspoCRM\\-10\\.0\\.3/api/v1/Email/([^/]+)/users|/EspoCRM\\-10\\.0\\.3/api/v1/EmailAccount/([^/]+)/resetFetchData()|/EspoCRM\\-10\\.0\\.3/api/v1/InboundEmail/([^/]+)/resetFetchData()()|/EspoCRM\\-10\\.0\\.3/api/v1/OAuth/([^/]+)/connection()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/followers()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Note/([^/]+)/pin()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/([^/]+)()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Pipeline/([^/]+)/move/([^/]+)()()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/PipelineStage/([^/]+)/move/([^/]+)()()()()()()()())$~',
        'routeMap' => 
        array (
          2 => 
          array (
            0 => 'route86',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          3 => 
          array (
            0 => 'route97',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          4 => 
          array (
            0 => 'route98',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          5 => 
          array (
            0 => 'route101',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          6 => 
          array (
            0 => 'route106',
            1 => 
            array (
              'controller' => 'controller',
            ),
          ),
          7 => 
          array (
            0 => 'route111',
            1 => 
            array (
              'entityType' => 'entityType',
              'id' => 'id',
            ),
          ),
          8 => 
          array (
            0 => 'route119',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          9 => 
          array (
            0 => 'route125',
            1 => 
            array (
              'controller' => 'controller',
              'id' => 'id',
              'link' => 'link',
            ),
          ),
          10 => 
          array (
            0 => 'route127',
            1 => 
            array (
              'id' => 'id',
              'type' => 'type',
            ),
          ),
          11 => 
          array (
            0 => 'route128',
            1 => 
            array (
              'id' => 'id',
              'type' => 'type',
            ),
          ),
        ),
      ),
    ),
    'DELETE' => 
    array (
      0 => 
      array (
        'regex' => '~^(?|/EspoCRM\\-10\\.0\\.3/api/v1/Campaign/unsubscribe/([^/]+)|/EspoCRM\\-10\\.0\\.3/api/v1/Campaign/unsubscribe/([^/]+)/([^/]+)|/EspoCRM\\-10\\.0\\.3/api/v1/Admin/fieldManager/([^/]+)/([^/]+)()|/EspoCRM\\-10\\.0\\.3/api/v1/Note/([^/]+)/myReactions/([^/]+)()()|/EspoCRM\\-10\\.0\\.3/api/v1/Notification/group/([^/]+)()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/OAuth/([^/]+)/connection()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/followers()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/subscription()()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Note/([^/]+)/pin()()()()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/starSubscription()()()()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/([^/]+)()()()()()()()()())$~',
        'routeMap' => 
        array (
          2 => 
          array (
            0 => 'route12',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          3 => 
          array (
            0 => 'route14',
            1 => 
            array (
              'emailAddress' => 'emailAddress',
              'hash' => 'hash',
            ),
          ),
          4 => 
          array (
            0 => 'route44',
            1 => 
            array (
              'scope' => 'scope',
              'name' => 'name',
            ),
          ),
          5 => 
          array (
            0 => 'route67',
            1 => 
            array (
              'id' => 'id',
              'type' => 'type',
            ),
          ),
          6 => 
          array (
            0 => 'route71',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          7 => 
          array (
            0 => 'route102',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          8 => 
          array (
            0 => 'route109',
            1 => 
            array (
              'controller' => 'controller',
              'id' => 'id',
            ),
          ),
          9 => 
          array (
            0 => 'route112',
            1 => 
            array (
              'entityType' => 'entityType',
              'id' => 'id',
            ),
          ),
          10 => 
          array (
            0 => 'route117',
            1 => 
            array (
              'controller' => 'controller',
              'id' => 'id',
            ),
          ),
          11 => 
          array (
            0 => 'route120',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          12 => 
          array (
            0 => 'route122',
            1 => 
            array (
              'entityType' => 'entityType',
              'id' => 'id',
            ),
          ),
          13 => 
          array (
            0 => 'route126',
            1 => 
            array (
              'controller' => 'controller',
              'id' => 'id',
              'link' => 'link',
            ),
          ),
        ),
      ),
    ),
    'OPTIONS' => 
    array (
      0 => 
      array (
        'regex' => '~^(?|/EspoCRM\\-10\\.0\\.3/api/v1/LeadCapture/([^/]+))$~',
        'routeMap' => 
        array (
          2 => 
          array (
            0 => 'route30',
            1 => 
            array (
              'apiKey' => 'apiKey',
            ),
          ),
        ),
      ),
    ),
    'PUT' => 
    array (
      0 => 
      array (
        'regex' => '~^(?|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/action/([^/]+)|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/layout/([^/]+)()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/layout/([^/]+)/([^/]+)()|/EspoCRM\\-10\\.0\\.3/api/v1/Admin/fieldManager/([^/]+)/([^/]+)()()()|/EspoCRM\\-10\\.0\\.3/api/v1/Team/([^/]+)/userPosition()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/subscription()()()()()()|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)/starSubscription()()()()()()())$~',
        'routeMap' => 
        array (
          3 => 
          array (
            0 => 'route32',
            1 => 
            array (
              'controller' => 'controller',
              'action' => 'action',
            ),
          ),
          4 => 
          array (
            0 => 'route35',
            1 => 
            array (
              'controller' => 'controller',
              'name' => 'name',
            ),
          ),
          5 => 
          array (
            0 => 'route36',
            1 => 
            array (
              'controller' => 'controller',
              'name' => 'name',
              'setId' => 'setId',
            ),
          ),
          6 => 
          array (
            0 => 'route42',
            1 => 
            array (
              'scope' => 'scope',
              'name' => 'name',
            ),
          ),
          7 => 
          array (
            0 => 'route96',
            1 => 
            array (
              'id' => 'id',
            ),
          ),
          8 => 
          array (
            0 => 'route107',
            1 => 
            array (
              'controller' => 'controller',
              'id' => 'id',
            ),
          ),
          9 => 
          array (
            0 => 'route116',
            1 => 
            array (
              'controller' => 'controller',
              'id' => 'id',
            ),
          ),
          10 => 
          array (
            0 => 'route121',
            1 => 
            array (
              'entityType' => 'entityType',
              'id' => 'id',
            ),
          ),
        ),
      ),
    ),
    'PATCH' => 
    array (
      0 => 
      array (
        'regex' => '~^(?|/EspoCRM\\-10\\.0\\.3/api/v1/Admin/fieldManager/([^/]+)/([^/]+)|/EspoCRM\\-10\\.0\\.3/api/v1/([^/]+)/([^/]+)())$~',
        'routeMap' => 
        array (
          3 => 
          array (
            0 => 'route43',
            1 => 
            array (
              'scope' => 'scope',
              'name' => 'name',
            ),
          ),
          4 => 
          array (
            0 => 'route108',
            1 => 
            array (
              'controller' => 'controller',
              'id' => 'id',
            ),
          ),
        ),
      ),
    ),
  ),
);