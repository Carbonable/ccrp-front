/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any };
};

export type AddAllocationRequestItem = {
  amount: Scalars['Int']['input'];
  business_unit_id: Scalars['String']['input'];
  project_id?: InputMaybe<Scalars['String']['input']>;
};

export type AddAllocationResponse = {
  __typename?: 'AddAllocationResponse';
  allocationIds: Array<Maybe<Scalars['String']['output']>>;
  errors: Array<Maybe<Scalars['String']['output']>>;
};

export type Allocation = {
  __typename?: 'Allocation';
  amount?: Maybe<Scalars['Int']['output']>;
  project?: Maybe<Scalars['String']['output']>;
};

export type AllocationAvailability = {
  __typename?: 'AllocationAvailability';
  available_percent?: Maybe<Scalars['Float']['output']>;
  available_units?: Maybe<Scalars['Int']['output']>;
};

export type Annual = {
  __typename?: 'Annual';
  data?: Maybe<Array<Maybe<AnnualData>>>;
  page_info?: Maybe<PageInfo>;
};

export type AnnualData = {
  __typename?: 'AnnualData';
  actual_rate?: Maybe<Scalars['Float']['output']>;
  debt?: Maybe<Scalars['Float']['output']>;
  delta?: Maybe<Scalars['Float']['output']>;
  emissions?: Maybe<Scalars['Int']['output']>;
  ex_ante_stock?: Maybe<Scalars['Int']['output']>;
  ex_post_issued?: Maybe<Scalars['Int']['output']>;
  ex_post_purchased?: Maybe<Scalars['Int']['output']>;
  ex_post_retired?: Maybe<Scalars['Int']['output']>;
  ex_post_stock?: Maybe<Scalars['Int']['output']>;
  target?: Maybe<Scalars['Int']['output']>;
  time_period?: Maybe<Scalars['String']['output']>;
  total_ex_ante?: Maybe<Scalars['Int']['output']>;
  total_ex_post?: Maybe<Scalars['Int']['output']>;
};

export type AssetAllocationItem = {
  __typename?: 'AssetAllocationItem';
  id: Scalars['String']['output'];
  metadata: Array<Maybe<Map>>;
  name: Scalars['String']['output'];
};

export type BusinessUnit = {
  __typename?: 'BusinessUnit';
  actual_rate?: Maybe<Scalars['String']['output']>;
  allocations?: Maybe<Array<Maybe<Allocation>>>;
  default_emission?: Maybe<Scalars['Int']['output']>;
  default_target?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Array<Maybe<Metadata>>>;
  name?: Maybe<Scalars['String']['output']>;
  yearly_contributions?: Maybe<Scalars['String']['output']>;
  yearly_emissions?: Maybe<Scalars['String']['output']>;
};

export type BusinessUnitCarbonAssetAllocation = {
  __typename?: 'BusinessUnitCarbonAssetAllocation';
  data: Array<Maybe<BusinessUnitCarbonAssetAllocationData>>;
  page_info?: Maybe<PageInfo>;
};

export type BusinessUnitCarbonAssetAllocationData = {
  __typename?: 'BusinessUnitCarbonAssetAllocationData';
  allocated?: Maybe<Scalars['Int']['output']>;
  forward?: Maybe<Scalars['Int']['output']>;
  generated?: Maybe<Scalars['Int']['output']>;
  project: AssetAllocationItem;
  retired?: Maybe<Scalars['Int']['output']>;
  total_cu?: Maybe<Scalars['Int']['output']>;
};

export type CarbonCredit = {
  __typename?: 'CarbonCredit';
  id: Scalars['ID']['output'];
  isLocked: Scalars['Boolean']['output'];
  isRetired: Scalars['Boolean']['output'];
  number?: Maybe<Scalars['String']['output']>;
  origin: CarbonCreditOrigin;
  project?: Maybe<Project>;
  type: CarbonCreditType;
  vintage?: Maybe<Scalars['String']['output']>;
};

export enum CarbonCreditOrigin {
  DirectPurchase = 'DIRECT_PURCHASE',
  ForwardFinance = 'FORWARD_FINANCE',
}

export enum CarbonCreditType {
  Biochar = 'BIOCHAR',
  Concervation = 'CONCERVATION',
  Dac = 'DAC',
  Reforestation = 'REFORESTATION',
  Restoration = 'RESTORATION',
  SolarPanel = 'SOLAR_PANEL',
}

export type Certifier = {
  __typename?: 'Certifier';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  projects?: Maybe<Array<Project>>;
  slug: Scalars['String']['output'];
};

export type CompanyCarbonAssetAllocation = {
  __typename?: 'CompanyCarbonAssetAllocation';
  data: Array<Maybe<CompanyCarbonAssetAllocationData>>;
  page_info?: Maybe<PageInfo>;
};

export type CompanyCarbonAssetAllocationData = {
  __typename?: 'CompanyCarbonAssetAllocationData';
  allocation_rate?: Maybe<Scalars['String']['output']>;
  business_units?: Maybe<Array<Maybe<AssetAllocationItem>>>;
  ex_ante_to_date?: Maybe<Scalars['Int']['output']>;
  ex_post_to_date?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  project_completion?: Maybe<Scalars['String']['output']>;
  project_name?: Maybe<Scalars['String']['output']>;
  total_allocated_to_date?: Maybe<Scalars['Int']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
  total_available_to_date?: Maybe<Scalars['Int']['output']>;
  total_potential?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Country = {
  __typename?: 'Country';
  code: Scalars['String']['output'];
  data: Scalars['JSON']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CreateBusinessUnitRequest = {
  company_id: Scalars['String']['input'];
  default_forecasted_emission?: InputMaybe<Scalars['Int']['input']>;
  default_target?: InputMaybe<Scalars['Int']['input']>;
  description: Scalars['String']['input'];
  metadata: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateBusinessUnitResponse = {
  __typename?: 'CreateBusinessUnitResponse';
  errors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id: Scalars['String']['output'];
};

export type CreateForecastedEmissionsRequest = {
  business_unit_id: Scalars['String']['input'];
  data: Array<ForecastedData>;
};

export type CreateForecastedTargetsRequest = {
  business_unit_id: Scalars['String']['input'];
  data: Array<ForecastedData>;
};

export type Cumulative = {
  __typename?: 'Cumulative';
  data?: Maybe<Array<Maybe<CumulativeData>>>;
  page_info?: Maybe<PageInfo>;
};

export type CumulativeData = {
  __typename?: 'CumulativeData';
  actual_rate?: Maybe<Scalars['Float']['output']>;
  debt?: Maybe<Scalars['Int']['output']>;
  delta?: Maybe<Scalars['Float']['output']>;
  emissions?: Maybe<Scalars['Int']['output']>;
  ex_ante_stock?: Maybe<Scalars['Int']['output']>;
  ex_post_issued?: Maybe<Scalars['Int']['output']>;
  ex_post_purchased?: Maybe<Scalars['Int']['output']>;
  ex_post_retired?: Maybe<Scalars['Int']['output']>;
  ex_post_stock?: Maybe<Scalars['Int']['output']>;
  target?: Maybe<Scalars['Int']['output']>;
  time_period?: Maybe<Scalars['String']['output']>;
};

export type Developper = {
  __typename?: 'Developper';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  projects?: Maybe<Array<Project>>;
  slug: Scalars['String']['output'];
};

export type DomainResponse = {
  __typename?: 'DomainResponse';
  errors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id: Scalars['String']['output'];
};

export type FinancialAnalysis = {
  __typename?: 'FinancialAnalysis';
  data?: Maybe<Array<Maybe<FinancialAnalysisData>>>;
  page_info?: Maybe<PageInfo>;
};

export type FinancialAnalysisData = {
  __typename?: 'FinancialAnalysisData';
  all_time_avg_issued_price?: Maybe<Scalars['Float']['output']>;
  all_time_avg_price?: Maybe<Scalars['Float']['output']>;
  all_time_avg_purchased_price?: Maybe<Scalars['Float']['output']>;
  avg_issued_price?: Maybe<Scalars['Float']['output']>;
  avg_price?: Maybe<Scalars['Float']['output']>;
  avg_purchased_price?: Maybe<Scalars['Float']['output']>;
  cumulative_emission_debt?: Maybe<Scalars['Float']['output']>;
  cumulative_total_amount?: Maybe<Scalars['Float']['output']>;
  emission_debt?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
  total_issued_amount?: Maybe<Scalars['Float']['output']>;
  total_purchased_amount?: Maybe<Scalars['Float']['output']>;
  year?: Maybe<Scalars['String']['output']>;
};

export type ForecastedData = {
  quantity?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['String']['input']>;
};

export type GlobalData = {
  __typename?: 'GlobalData';
  actual: Scalars['String']['output'];
  debt: Scalars['String']['output'];
  invested_amount: Scalars['String']['output'];
  number_of_projects: Scalars['String']['output'];
  target: Scalars['String']['output'];
};

export type ImpactMetrics = {
  __typename?: 'ImpactMetrics';
  protected_forest: Scalars['String']['output'];
  protected_species: Scalars['String']['output'];
  removed_tons: Scalars['String']['output'];
  sdgs: Array<Sdg>;
};

export type LocalizationRepartition = {
  __typename?: 'LocalizationRepartition';
  country: ShortCountry;
  value: Scalars['String']['output'];
};

export type Map = {
  __typename?: 'Map';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Metadata = {
  __typename?: 'Metadata';
  key?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addAllocations?: Maybe<AddAllocationResponse>;
  createBusinessUnit?: Maybe<DomainResponse>;
  createForecastedEmissions?: Maybe<DomainResponse>;
  createForecastedTargets?: Maybe<DomainResponse>;
};

export type MutationAddAllocationsArgs = {
  request: Array<InputMaybe<AddAllocationRequestItem>>;
};

export type MutationCreateBusinessUnitArgs = {
  request: CreateBusinessUnitRequest;
};

export type MutationCreateForecastedEmissionsArgs = {
  request: CreateForecastedEmissionsRequest;
};

export type MutationCreateForecastedTargetsArgs = {
  request: CreateForecastedTargetsRequest;
};

export type NetZeroPlanning = {
  __typename?: 'NetZeroPlanning';
  actual?: Maybe<Scalars['Float']['output']>;
  consumed?: Maybe<Scalars['Int']['output']>;
  emission?: Maybe<Scalars['Int']['output']>;
  ex_ante_count?: Maybe<Scalars['Int']['output']>;
  ex_post_count?: Maybe<Scalars['Int']['output']>;
  retired?: Maybe<Scalars['Int']['output']>;
  target?: Maybe<Scalars['Int']['output']>;
  vintage?: Maybe<Scalars['String']['output']>;
};

export enum OffsetType {
  ExAnte = 'EX_ANTE',
  ExPost = 'EX_POST',
}

export type PageInfo = {
  __typename?: 'PageInfo';
  has_next_page: Scalars['Boolean']['output'];
  has_previous_page: Scalars['Boolean']['output'];
  total_page: Scalars['Int']['output'];
};

export type Pagination = {
  count: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};

export type PaginationObject = {
  __typename?: 'PaginationObject';
  has_next_page?: Maybe<Scalars['Boolean']['output']>;
  has_previous_page?: Maybe<Scalars['Boolean']['output']>;
  next_cursor?: Maybe<Scalars['String']['output']>;
  total_page?: Maybe<Scalars['Int']['output']>;
};

export type Project = {
  __typename?: 'Project';
  area?: Maybe<Scalars['Int']['output']>;
  certifier: Certifier;
  country?: Maybe<Country>;
  description?: Maybe<Scalars['String']['output']>;
  developper?: Maybe<Developper>;
  endDate?: Maybe<Scalars['String']['output']>;
  global_data?: Maybe<ProjectGlobalData>;
  id: Scalars['ID']['output'];
  localization?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  origin?: Maybe<CarbonCreditOrigin>;
  slug?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['String']['output']>;
  type?: Maybe<CarbonCreditType>;
  vintages?: Maybe<Array<Vintage>>;
};

export type ProjectCarbonAssetAllocation = {
  __typename?: 'ProjectCarbonAssetAllocation';
  data: Array<Maybe<ProjectCarbonAssetAllocationData>>;
  page_info?: Maybe<PageInfo>;
};

export type ProjectCarbonAssetAllocationData = {
  __typename?: 'ProjectCarbonAssetAllocationData';
  actual?: Maybe<Scalars['Int']['output']>;
  allocated?: Maybe<Scalars['Int']['output']>;
  allocation_amount?: Maybe<Scalars['Int']['output']>;
  business_unit: AssetAllocationItem;
  start_date?: Maybe<Scalars['String']['output']>;
  target?: Maybe<Scalars['Int']['output']>;
};

export type ProjectColorRepartition = {
  __typename?: 'ProjectColorRepartition';
  blue: Map;
  green: Map;
  na: Map;
  orange: Map;
};

export type ProjectFundingAllocation = {
  __typename?: 'ProjectFundingAllocation';
  allocation: Scalars['String']['output'];
  color: Scalars['String']['output'];
  comitted_cc: Scalars['String']['output'];
  forwarded_cc: Scalars['String']['output'];
  generated_cc: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  retired_cc: Scalars['String']['output'];
};

export type ProjectGlobalData = {
  __typename?: 'ProjectGlobalData';
  allocated_units?: Maybe<Scalars['Int']['output']>;
  amount?: Maybe<Scalars['Int']['output']>;
  available_ex_ante?: Maybe<Scalars['Int']['output']>;
  available_ex_post?: Maybe<Scalars['Int']['output']>;
  rating?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
};

export type ProjectMetrics = {
  __typename?: 'ProjectMetrics';
  colors: ProjectColorRepartition;
  localization: Array<LocalizationRepartition>;
  standards: Array<Map>;
  types: ProjectTypeRepartition;
};

export enum ProjectType {
  Arr = 'ARR',
  ReddPlus = 'REDD_PLUS',
}

export type ProjectTypeRepartition = {
  __typename?: 'ProjectTypeRepartition';
  avoidance: Scalars['String']['output'];
  removal: Scalars['String']['output'];
};

export type ProjectedDecarbonation = {
  __typename?: 'ProjectedDecarbonation';
  delta?: Maybe<Scalars['String']['output']>;
  emissions: Scalars['String']['output'];
  forward_cc: Scalars['String']['output'];
  purchased_cc: Scalars['String']['output'];
  received_cc: Scalars['String']['output'];
  retired_cc: Scalars['String']['output'];
  target: Scalars['String']['output'];
  year: Scalars['String']['output'];
};

export type ProjectedDecarbonationGraph = {
  __typename?: 'ProjectedDecarbonationGraph';
  data: Array<Maybe<StrIntMap>>;
  emissions: Scalars['Int']['output'];
  target: Scalars['Int']['output'];
  year: Scalars['String']['output'];
};

export enum ProjectedDecarbonationViewType {
  InvestmentType = 'INVESTMENT_TYPE',
  OffsetType = 'OFFSET_TYPE',
  ProjectType = 'PROJECT_TYPE',
}

export type ProjectedDecarbonationWithPagination = {
  __typename?: 'ProjectedDecarbonationWithPagination';
  data: Array<ProjectedDecarbonation>;
  pagination?: Maybe<PaginationObject>;
};

export type ProjectedFundingAllocationWithPagination = {
  __typename?: 'ProjectedFundingAllocationWithPagination';
  data: Array<ProjectFundingAllocation>;
  pagination?: Maybe<PaginationObject>;
};

export type Query = {
  __typename?: 'Query';
  annual: Annual;
  availableToAllocate?: Maybe<AllocationAvailability>;
  businessUnitCarbonAssetAllocation?: Maybe<BusinessUnitCarbonAssetAllocation>;
  businessUnitDetails?: Maybe<BusinessUnit>;
  businessUnits?: Maybe<Array<Maybe<BusinessUnit>>>;
  businessUnitsBy?: Maybe<Array<Maybe<BusinessUnit>>>;
  certifierBy?: Maybe<Certifier>;
  companyCarbonAssetAllocation?: Maybe<CompanyCarbonAssetAllocation>;
  countries?: Maybe<Array<Maybe<Country>>>;
  countryBy?: Maybe<Country>;
  cumulative: Cumulative;
  financialAnalysis: FinancialAnalysis;
  getGlobalData?: Maybe<GlobalData>;
  getImpactMetrics: ImpactMetrics;
  getProjectFundingAllocation?: Maybe<ProjectedFundingAllocationWithPagination>;
  getProjectMetrics: ProjectMetrics;
  getStock?: Maybe<Stock>;
  netZeroPlanning: Array<Maybe<NetZeroPlanning>>;
  projectBy?: Maybe<Project>;
  projectCarbonAssetAllocation?: Maybe<ProjectCarbonAssetAllocation>;
  projects?: Maybe<Array<Maybe<Project>>>;
};

export type QueryAnnualArgs = {
  pagination?: InputMaybe<Pagination>;
  view: VisualizationViewType;
};

export type QueryAvailableToAllocateArgs = {
  business_unit_id: Scalars['String']['input'];
  project_id: Scalars['String']['input'];
};

export type QueryBusinessUnitCarbonAssetAllocationArgs = {
  id: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
};

export type QueryBusinessUnitDetailsArgs = {
  id: Scalars['String']['input'];
};

export type QueryBusinessUnitsByArgs = {
  field: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type QueryCertifierByArgs = {
  field: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type QueryCompanyCarbonAssetAllocationArgs = {
  id: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
};

export type QueryCountryByArgs = {
  field: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type QueryCumulativeArgs = {
  pagination?: InputMaybe<Pagination>;
  view: VisualizationViewType;
};

export type QueryFinancialAnalysisArgs = {
  pagination?: InputMaybe<Pagination>;
  view: VisualizationViewType;
};

export type QueryGetGlobalDataArgs = {
  view?: InputMaybe<VisualizationViewType>;
};

export type QueryGetImpactMetricsArgs = {
  view?: InputMaybe<VisualizationViewType>;
};

export type QueryGetProjectFundingAllocationArgs = {
  view?: InputMaybe<VisualizationViewType>;
};

export type QueryGetProjectMetricsArgs = {
  view?: InputMaybe<VisualizationViewType>;
};

export type QueryGetStockArgs = {
  pagination?: InputMaybe<Pagination>;
  view?: InputMaybe<VisualizationViewType>;
};

export type QueryNetZeroPlanningArgs = {
  view?: InputMaybe<VisualizationViewType>;
};

export type QueryProjectByArgs = {
  field: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type QueryProjectCarbonAssetAllocationArgs = {
  id: Scalars['String']['input'];
  pagination?: InputMaybe<Pagination>;
};

export type Sdg = {
  __typename?: 'Sdg';
  name: Scalars['String']['output'];
  number: Scalars['Int']['output'];
};

export type ShortCountry = {
  __typename?: 'ShortCountry';
  flag: Scalars['String']['output'];
  iso: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Stock = {
  __typename?: 'Stock';
  data: Array<Maybe<StockData>>;
  page_info?: Maybe<PageInfo>;
};

export type StockData = {
  __typename?: 'StockData';
  available: Scalars['Int']['output'];
  project: AssetAllocationItem;
  quantity: Scalars['Int']['output'];
  vintage: Scalars['String']['output'];
};

export type StrIntMap = {
  __typename?: 'StrIntMap';
  key: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type Vintage = {
  __typename?: 'Vintage';
  capacity?: Maybe<Scalars['Int']['output']>;
  consumed?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  issued_price?: Maybe<Scalars['Int']['output']>;
  purchased?: Maybe<Scalars['Int']['output']>;
  purchased_price?: Maybe<Scalars['Int']['output']>;
  reserved?: Maybe<Scalars['Int']['output']>;
  year?: Maybe<Scalars['String']['output']>;
};

export type VisualizationViewType = {
  business_unit_id?: InputMaybe<Scalars['String']['input']>;
  company_id?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['String']['input']>;
};
