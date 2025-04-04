type DataSourceType = 'csv' | 'ndjson' | 's3_iamrole' | 'kafka' | 'datasource'

export type DataSourceOrigin = DataSourceType | 'copy' | 'materialized'

export type DataSource = {
  id: string
  name: string
  description: string | null
  type: DataSourceType
  updated_at: string
  statistics: {
    row_count: number | null
    bytes: number | null
  }
  used_by: {
    id: string
    name: string
  }[]
  origin: DataSourceOrigin
  columns?: {
    name: string
    type: string
    jsonpath: string | null
  }[]
}

export type WorkspaceRole = 'admin' | 'admin_user' | 'user' | 'viewer'

export type WorkspaceMember = {
  id: string
  created_at: string
  email: string
  max_owned_workspaces: number
  max_workspaces: number
  notifications: string[]
  role: WorkspaceRole
}

export type WorkspaceNewMember = {
  email: string
  role: WorkspaceRole
}

export type Workspace = {
  id: string
  name: string
  token: string
  plan: string
  created_at: string
  members?: WorkspaceMember[]
  organization?: Organization
  max_seats: number
  is_forward: boolean
}

export type Organization = {
  id: string
  name: string
  domain: string | null
}

export type OrganizationWorkspace = {
  id: string
  name: string
  in_dedicated_cluster?: boolean
  members: number
  last_deployment?: string
  is_forward: boolean
}

export type OrganizationMember = {
  id: string
  email: string
  is_admin: boolean
}

export type ParameterValue = string | number | null

export type Parameter = {
  name: string
  description?: string
  required?: boolean
  type?: string
  default?: ParameterValue
}

export type Node = {
  id: string
  name: string
  sql: string | null
  dependencies: string[] | null
  params: Parameter[] | null
  node_type:
    | 'standard'
    | 'materialized'
    | 'endpoint'
    | 'copy'
    | 'sink'
    | 'stream'
    | 'timeseries'
  updated_at: string
  created_at: string
  description: string | null
  materialized?: string | null
  tags?: Record<string, string | number | boolean | null>
}

export type Pipe = {
  id: string
  name: string
  description: string | null
  type: 'endpoint' | 'copy' | 'materialized' | 'sink' | 'stream' | 'default'
  created_at: string
  updated_at: string
  nodes?: Node[] | null
  copy_mode?: 'append' | 'replace'
  copy_node?: string
  copy_target_datasource?: string
  schedule?: {
    cron: string | null
    status: 'shutdown' | 'running'
  }
  endpoint?: string | null
}

export type CopyPipe = Pipe & {
  copy_mode: 'append' | 'replace'
  copy_node: string
  copy_target_datasource: string
  schedule: {
    cron: string | null
    status: 'shutdown' | 'running'
  }
  type: 'copy'
}

export type MaterializedPipe = Pipe & {
  type: 'materialized'
  nodes: {
    node_type: 'materialized'
    materialized: string
  }[]
}

export type EndpointPipe = Pipe & {
  type: 'endpoint'
  endpoint: string
}

export type Deployment = {
  id: string
  live: boolean
  status:
    | 'calculating'
    | 'creating_schema'
    | 'schema_ready'
    | 'data_ready'
    | 'deleting'
    | 'deleted'
    | 'failed'
  status_display: 'Live' | 'Staging' | 'Ready' | 'Failed' | 'Deleted' | 'In progress'
  created_at: string
  errors: string[]
  feedback: string[]
  new_datasource_names: string[]
  new_pipe_names: string[]
  new_data_connector_names: string[]
  changed_datasource_names: string[]
  changed_pipe_names: string[]
  changed_data_connector_names: string[]
  deleted_datasource_names: string[]
  deleted_pipe_names: string[]
  deleted_data_connector_names: string[]
}

export type QueryColumn = {
  name: string
  type: string
}

export type QueryMeta = QueryColumn[]

export type QueryStatistics = {
  bytes_read: number
  elapsed: number
  rows_read: number
}

export type QueryData = Record<string, unknown>[]

export type User = {
  id: string
  email: string
  organization_id: string | null
  organization_name: string | null
  organization_by_domain: string | null
}

export type UserWithWorkspaces = User & {
  workspaces: Workspace[]
}

export type TokenScopeType =
  | 'ADMIN'
  | 'USER'
  | 'DATASOURCES:READ'
  | 'DATASOURCES:CREATE'
  | 'DATASOURCES:DROP'
  | 'DATASOURCES:APPEND'
  | 'ADMIN_USER'
  | 'PIPES:READ'
  | 'PIPES:CREATE'
  | 'PIPES:DROP'
  | 'TOKENS'

export type TokenScope = {
  type: TokenScopeType
  resource?: string
  filter?: string | null
}

export type TokenScopeOption = 'READ' | 'APPEND' | 'DROP'

export type TokenOriginType = 'C' | 'P' | 'TS' | 'DS'

export type TokenOrigin = {
  type: TokenOriginType
  resourceId?: string
  resource_id?: string
}

export type Token = {
  id: string
  name: string
  description: string
  token: string
  scopes: TokenScope[]
  origin: TokenOrigin
  created_at?: string
  updated_at?: string
  featured?: boolean
}

export const timeRanges: TimeRange[] = [
  {
    label: '1 minute',
    period: '1 minute',
    value: 1 * 60,
    unit: 'second',
    realtime: true,
    prevRealtime: true,
    separator: false,
    granularity: 1
  },
  {
    label: '5 minutes',
    period: '5 minute',
    value: 5 * 60,
    unit: 'second',
    realtime: true,
    prevRealtime: true,
    separator: false,
    granularity: 1
  },
  {
    label: '15 minutes',
    period: '15 minute',
    value: 15 * 60,
    unit: 'second',
    realtime: true,
    prevRealtime: true,
    separator: false,
    granularity: 1
  },
  {
    label: '30 minutes',
    period: '30 minute',
    value: 30 * 60,
    unit: 'second',
    realtime: true,
    prevRealtime: true,
    separator: true,
    granularity: 5
  },
  {
    label: '1 hour',
    period: '1 hour',
    value: 1 * 60 * 60,
    unit: 'second',
    realtime: true,
    prevRealtime: true,
    separator: false,
    granularity: 10
  },
  {
    label: '2 hours',
    period: '2 hour',
    value: 2 * 60 * 60,
    unit: 'second',
    realtime: true,
    prevRealtime: true,
    separator: false,
    granularity: 60 * 10
  },
  {
    label: '6 hours',
    period: '6 hour',
    value: 6 * 60 * 60,
    unit: 'second',
    realtime: true,
    prevRealtime: true,
    separator: false,
    granularity: 60 * 30
  },
  {
    label: '12 hours',
    period: '12 hour',
    value: 12 * 60 * 60,
    unit: 'second',
    realtime: true,
    prevRealtime: true,
    separator: true,
    granularity: 60 * 30
  },
  {
    label: '1 day',
    period: '1 day',
    value: 1 * 24 * 60 * 60,
    unit: 'second',
    realtime: true,
    prevRealtime: true,
    separator: false,
    granularity: 60 * 60
  },
  {
    label: '7 days',
    period: '7 day',
    value: 7 * 24 * 60 * 60,
    unit: 'second',
    realtime: false,
    prevRealtime: false,
    separator: false,
    granularity: 60 * 60 * 8
  }
  // {
  //   label: '30 days',
  //   period: '30 day',
  //   value: 30 * 24 * 60 * 60,
  //   unit: 'second',
  //   realtime: false,
  //   prevRealtime: false,
  //   separator: false,
  //   granularity: 60 * 60 * 24
  // }
]

export const timeRangeOneDay = timeRanges[8]

export const timeGranularities = [
  {
    '1 second': 1,
    '5 seconds': 5,
    '10 seconds': 10,
    '15 seconds': 15,
    '30 seconds': 30
  },
  {
    '1 minute': 60,
    '5 minutes': 5 * 60,
    '10 minutes': 10 * 60,
    '30 minutes': 30 * 60
  },
  {
    '1 hour': 60 * 60,
    '2 hours': 2 * 60 * 60,
    '6 hours': 6 * 60 * 60,
    '12 hours': 12 * 60 * 60,
    '18 hours': 18 * 60 * 60
  },
  {
    '1 day': 24 * 60 * 60,
    '2 days': 2 * 24 * 60 * 60,
    '5 days': 5 * 24 * 60 * 60,
    '7 days': 7 * 24 * 60 * 60,
    '30 days': 30 * 24 * 60 * 60
  }
] as const

export function getGranularitiesPerTimeRange(lastMinutes: number) {
  const granularitiesPerTimeRange = {
    [1 * 60]: ['1 second', '5 seconds', '10 seconds', '15 seconds', '30 seconds'],
    [5 * 60]: [
      '1 second',
      '5 seconds',
      '10 seconds',
      '15 seconds',
      '30 seconds',
      '1 minute'
    ],
    [15 * 60]: [
      '1 second',
      '5 seconds',
      '15 seconds',
      '30 seconds',
      '1 minute',
      '5 minutes'
    ],
    [30 * 60]: [
      '5 seconds',
      '15 seconds',
      '30 seconds',
      '1 minute',
      '5 minutes',
      '10 minutes'
    ],
    [60 * 60]: [
      '15 seconds',
      '30 seconds',
      '1 minute',
      '5 minutes',
      '10 minutes',
      '15 minutes'
    ],
    [2 * 60 * 60]: [
      '30 seconds',
      '1 minute',
      '5 minutes',
      '10 minutes',
      '15 minutes',
      '30 minutes'
    ],
    [6 * 60 * 60]: ['1 minute', '5 minutes', '10 minutes', '30 minutes', '1 hour'],
    [12 * 60 * 60]: [
      '1 minute',
      '5 minutes',
      '15 minutes',
      '30 minutes',
      '1 hour',
      '2 hours'
    ],
    [24 * 60 * 60]: [
      '5 minutes',
      '15 minutes',
      '30 minutes',
      '1 hour',
      '2 hours',
      '6 hours'
    ],
    [7 * 24 * 60 * 60]: [
      '30 minutes',
      '1 hour',
      '2 hours',
      '6 hours',
      '12 hours',
      '1 day'
    ],
    [30 * 24 * 60 * 60]: [
      '1 hour',
      '2 hours',
      '6 hours',
      '12 hours',
      '1 day',
      '2 days',
      '5 days'
    ]
  } as Record<number, string[]>

  const granularities = granularitiesPerTimeRange[lastMinutes * 60]
  return timeGranularities
    .map(group =>
      Object.entries(group).filter(([label]) => granularities.includes(label))
    )
    .filter(group => group.length > 0)
}

export type TimeRange = {
  label: string
  period: string
  value: number
  unit: string
  realtime: boolean
  prevRealtime: boolean
  separator: boolean
  granularity: number
}

export type Exploration = {
  id: string
  description: string | null
  name: string
  nodes: Node[]
  created_at: string
  updated_at: string
}

export type TimeSeries = {
  id: string
  description: string | null
  title: string
  updated_at: string
  published: boolean
  configuration: {
    type: string
    lastUpdated: string
    origin: string
    name: string
    columnName: string
    visualize: string
    where: string
    groupBy: string
    having: string
    visType: 'bar' | 'line'
    lastMinutes: number
    maxDimensions: number
    startDateTime: string
    endDateTime: string
    realtime: number
    granularity: number
  }
}

export type Playground = {
  id: string
  description: string | null
  name: string
  created_at: string
  updated_at: string
  nodes: Node[]
}

export type QuickStartStatus = 'idle' | 'active' | 'completed'

export type Connector = {
  id: string
  name: string
  service: 'kafka' | 'gcscheduler' | 's3_iamrole' | 's3'
  linkers: Linker[]
  sinks: Sink[]
  settings: KafkaSettings | S3IAMRoleSettings | S3Settings
}

export type S3Settings = {
  s3_access_key_id: string
  s3_region: string
  s3_secret_access_key: string
}

export type S3IAMRoleSettings = {
  s3_iamrole_arn: string
  s3_iamrole_region: string
}

export type KafkaSettings = {
  kafka_bootstrap_servers: string
  kafka_sasl_mechanism: string
  kafka_sasl_plain_password?: string
  kafka_sasl_plain_username?: string
  kafka_schema_registry_url?: string
  kafka_security_protocol: string
}

export type KafkaLinkerSettings = {
  kafka_topic: string
}

export type Linker = {
  id: string
  name: string
  datasource_id: string
  data_connector_id: string
  settings?: KafkaLinkerSettings
}

export type Sink = {
  id: string
  name: string
  data_connector_id: string
  resource_id: string
  settings: S3SinkSettings | GCSinkSettings
}

export type GCSinkSettings = {
  cron: string
  status: string
  timezone: string
}

export type S3SinkSettings = {
  bucket_path: string
  compression: string
  partition_by: string
  file_template: string
}

export type RegionProvider = 'gcp' | 'aws' | 'local' | 'managed' | 'dev'

export type OrganizationInfra = {
  id: string
  name: string
  host: string
  token: string
  created_at: string
  updated_at: string
  organization_id: string
}

export type DataFile = {
  name: string
  type: 'pipe' | 'datasource'
  content: string
}

export type OrganizationBillingPlan =
  | 'total_usage'
  | 'monthly_usage'
  | 'no_usage'
  | 'infrastructure_usage'
  | 'shared_infrastructure_usage'
  | 'shared_infrastructure_usage_commitment'
  | 'mixed_infrastructure_usage'
  | 'free_shared_infrastructure_usage'

export type BillingSubscription = {
  start_date: string
  end_date: string
  plan_changes_blocked_until: string
  customer_portal: string
  current_billing_period_start_date: string
  current_billing_period_end_date: string
  billing_plan: OrganizationBillingPlan
  plan: BillingPlanFree | BillingPlanShared
}

export type BillingPlanFree = {
  plan_id: string
  number_of_cpus: number
  number_of_max_qps: number
  number_of_max_daily_queries: number
  number_of_max_threads: number
  number_of_max_copies: number
  number_of_max_sinks: number
  number_of_max_memory_bytes: number
  included_storage_in_gb: number
}

export type BillingPlanShared = {
  plan_id: string
  cost_of_additional_gb_storage: number
  cost_of_additional_active_minute: number
  cost_of_egress_gb_intra: number
  cost_of_egress_gb_inter: number
  cost_of_qps_overage: number
  fixed_monthly_fee: number
  fixed_monthly_fee_yearly_commitment: number
  included_storage_in_gb: number
  included_active_minutes: number
  number_of_cpus: number
  number_of_max_qps: number
  number_of_max_threads: number
  number_of_max_copies: number
  number_of_max_sinks: number
  number_of_max_memory_bytes: number
}

export type SubscriptionInvoice = {
  id: string
  status: string
  hosted_invoice_url: string
  invoice_number: string
  invoice_date: string
  invoice_pdf: string | null
  total: string
  subtotal: string
  currency: string
  amount_due: string
  line_items: {
    name: string
    quantity: number
    amount: string
  }[]
}

export type BillingDetails = {
  address: {
    city: string
    country: string
    line1: string
    line2: string
    postal_code: string
    state: string
  }
  card?: {
    brand: string
    country: string
    exp_month: number
    exp_year: number
    last4: string
  }
  tax_id?: {
    tax_type?: string
    value: string
  }
}

export const SubscriptionFreePlan = {
  start_date: null,
  end_date: null,
  current_billing_period_start_date: null,
  current_billing_period_end_date: null,
  plan_changes_blocked_until: null,
  billing_plan: 'free_shared_infrastructure_usage',
  plan: {
    plan_id: 'free_shared_infrastructure_usage',
    name: 'Free plan',
    number_of_cpus: 0.5,
    number_of_max_qps: 10,
    number_of_max_daily_queries: 1000,
    number_of_max_copies: 1,
    number_of_max_sinks: 0,
    number_of_max_threads: 1,
    included_active_minutes: 0,
    included_storage_in_gb: 10
  }
}

export type OrganizationLimits = {
  limits: {
    max_daily_requests?: {
      quantity: number
      max: number
    }
    active_minutes: {
      quantity: number
      max: number
    }
    storage_gb: {
      quantity: number
      max: number
    }
    copy_pipes: {
      quantity: number
      max: number
    }
    sink_pipes: {
      quantity: number
      max: number
    }
    qps_overages?: {
      quantity: number
      max: number | null
    }
  }
  alerts: {
    vcpu: boolean
  }
}

export type DataStreamDelta = {
  type:
    | 'text-delta'
    | 'code-delta'
    | 'create-node-code-delta'
    | 'create-node-code-delta-finish'
    | 'create-node-timeseries-delta'
    | 'create-node-timeseries-delta-finish'
    | 'sheet-delta'
    | 'image-delta'
    | 'title'
    | 'id'
    | 'suggestion'
    | 'clear'
    | 'finish'
    | 'kind'
    | 'nodeName'
    | 'nodeType'
    | 'nodeDescription'
    | 'xAxisKey'
    | 'yAxisKey'

  content: string
  nodeName?: string
}

export type Chat = {
  id: string
  messages: any[]
  created_at: string
  updated_at: string
}
