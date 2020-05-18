import { NextPage } from 'next'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CodelistsApi } from '../../api/CodelistsApi'
import { FundsApi } from '../../api/FundsApi'
import Filters from '../../components/funds/Filters'
import getFundTableColumns from '../../components/funds/FUND_TABLE_COLUMNS'
import MobileFundList from '../../components/funds/MobileFundList'
import SearchField from '../../components/funds/SearchField'
import Layout from '../../components/Layout'
import Table from '../../components/Table'
import { COLOR, FONT_SIZE, FONT_WEIGHT, SCREEN_SIZE } from '../../constants'
import useDeviceType from '../../hooks/useDeviceType'
import { useTranslation } from '../../i18n'
import { AssetClass } from '../../model/api/AssetClass'
import { Codelists } from '../../model/api/Codelists'
import { FilterParameters } from '../../model/api/FilterParameters'
import { Fund } from '../../model/api/Fund'
import { SortParameters } from '../../model/api/SortParameters'
import { getOptionsFromArray } from '../../utils/getOptions'
import Error from '../_error'

const FoundCount = styled.div`
  margin: 0 0 1rem 0.4rem;
  font-size: ${FONT_SIZE.MEDIUM};
  font-weight: ${FONT_WEIGHT.SEMIBOLD};
`

export const Paginator = styled.div<{ isHidden: boolean }>`
  display: ${({ isHidden }) => (isHidden ? 'none' : 'flex')};
  justify-content: space-between;
  width: 100%;
  margin-top: 2rem;
  font-weight: 600;

  ${SCREEN_SIZE.ABOVE_TABLET} {
    width: 15rem;
    margin-left: auto;
  }
`

export const PageSwitcher = styled.div<{ isHidden: boolean }>`
  visibility: ${({ isHidden }) => isHidden && 'hidden'};
  cursor: pointer;

  @media (hover: hover) {
    :hover {
      text-decoration: underline;
      color: ${COLOR.MAIN_BLUE};
    }
  }
`

const DEBOUNCE_WAIT_TIME = 300

let debounceTimeoutId: number | null = null

interface Props {
  funds: Fund[]
  queryId: string
  codelists: Codelists
  assetClasses: AssetClass[]
  totalPageCount?: number
  totalResultCount?: number
}

const Funds: NextPage<Props> = ({
  funds,
  queryId,
  codelists,
  assetClasses,
  totalPageCount,
  totalResultCount,
}) => {
  const { t } = useTranslation('funds')
  const [displayedFunds, setDisplayedFunds] = useState(funds)
  const [query, setQuery] = useState(queryId)
  const [resultCount, setResultCount] = useState(totalResultCount)
  const [pageCount, setPageCount] = useState(totalPageCount)
  const [searchedText, setSearchedText] = useState<string | undefined>(
    undefined
  )
  const [filterParams, setFilterParams] = useState<FilterParameters>()
  const [sortParams, setSortParams] = useState<SortParameters[]>()
  const [page, setPage] = useState(0)
  const [isLoading, seIsLoadingtState] = useState(false)

  const { isDesktop, isMobile } = useDeviceType()

  useEffect(() => {
    if (debounceTimeoutId !== null) {
      clearTimeout(debounceTimeoutId)
    }

    if (searchedText !== undefined) {
      debounceTimeoutId = setTimeout(search, DEBOUNCE_WAIT_TIME)
    }
  }, [searchedText])

  useEffect(
    () => () => {
      if (debounceTimeoutId) {
        clearTimeout(debounceTimeoutId)
      }
    },
    []
  )

  useEffect(() => {
    if (filterParams) {
      seIsLoadingtState(true)
      setDisplayedFunds([])

      const newFilterParams = filterParams

      if (
        newFilterParams.assetClass &&
        Object.entries(newFilterParams.assetClass).length !== 0
      ) {
        const convertedAssetClasses: number[] = newFilterParams.assetClass.reduce(
          (acc: number[], baseClassId) => {
            const associatedAssetClassIds = assetClasses
              .filter(assetClass => assetClass.baseTypeId === baseClassId)
              .map(assetClass => assetClass.id)

            return [...acc, ...associatedAssetClassIds]
          },
          []
        )

        newFilterParams.assetClass = convertedAssetClasses
      }

      FundsApi.getFunds({
        filterParameters: newFilterParams,
        sortParameters: sortParams || [],
        pagesParameters: { page: 1, pageSize: 25 },
      }).then(
        ({
          data: {
            funds: newFunds,
            queryId: newqueryId,
            totalPageCount: newPagecount,
            totalResultCount: newResultCount,
          },
        }) => {
          setDisplayedFunds(newFunds)
          setQuery(newqueryId)
          setResultCount(newResultCount)
          setPageCount(newPagecount)
          setPage(1)
          seIsLoadingtState(false)
        }
      )
    }
  }, [filterParams, sortParams])

  useEffect(() => {
    window.scrollTo({ top: 0 })

    if (page !== 0) {
      FundsApi.getFundsByQueryId(query, page).then(
        ({ data: { funds: newFunds } }) => {
          setDisplayedFunds(newFunds)
        }
      )
    }
  }, [page])

  const search = () => {
    setFilterParams(oldParams => ({ ...oldParams, textFilter: searchedText }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedText(e.target.value)
  }

  const handleFilterChange = (name: keyof FilterParameters) => (
    selected: any
  ) => {
    if (selected instanceof Array) {
      setFilterParams(oldParams => ({
        ...oldParams,
        [name]: selected,
      }))
    } else {
      setFilterParams(oldParams => ({
        ...oldParams,
        [name]: [],
      }))
    }
  }

  const handleSort = useCallback((newParams: SortParameters[]) => {
    setSortParams(newParams)
  }, [])

  const decrement = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1)
    }
  }

  const increment = () => {
    if (pageCount && page < pageCount) {
      setPage(prevPage => {
        if (prevPage === 0) {
          return prevPage + 2
        } else {
          return prevPage + 1
        }
      })
    }
  }

  const tableColumns = useMemo(
    () => getFundTableColumns(codelists, assetClasses, t),
    [codelists, assetClasses]
  )

  const baseAssetClassOptions = getOptionsFromArray(
    codelists.assetClassBaseType.values,
    'id',
    'name'
  )
  const regionOptions = getOptionsFromArray(
    codelists.investmentArea.values,
    'id',
    'name'
  )
  const currencyOptions = getOptionsFromArray(
    codelists.currency.values,
    'id',
    'code'
  )
  const basicIssuerOptions = getOptionsFromArray(
    codelists.basicIssuer.values,
    'id',
    'name'
  )

  if (!funds || !codelists) {
    return <Error />
  }
  return (
    <Layout backNavigationHref={'/'}>
      <SearchField value={searchedText || ''} onChange={handleSearchChange} />

      <Filters
        isDesktop={isDesktop}
        baseAssetClassOptions={baseAssetClassOptions}
        regionOptions={regionOptions}
        currencyOptions={currencyOptions}
        basicIssuerOptions={basicIssuerOptions}
        handleChange={handleFilterChange}
      />

      <FoundCount>{resultCount + ' ' + t('found')}</FoundCount>

      {isMobile && (
        <MobileFundList
          displayedFunds={displayedFunds}
          assetClasses={assetClasses}
          isLoading={isLoading}
        />
      )}

      {isDesktop && (
        <Table
          data={displayedFunds}
          columns={tableColumns}
          isLoading={isLoading}
          manual
          handleSort={handleSort}
        />
      )}

      <Paginator
        isHidden={(pageCount !== undefined && pageCount <= 1) || isLoading}
      >
        <PageSwitcher isHidden={page <= 1} onClick={decrement}>
          {t('previous-page')}
        </PageSwitcher>

        <div>{page === 0 ? 1 : page}</div>

        <PageSwitcher isHidden={page === 10} onClick={increment}>
          {t('next-page')}
        </PageSwitcher>
      </Paginator>
    </Layout>
  )
}

Funds.getInitialProps = async () => {
  const {
    data: { funds, queryId, totalPageCount, totalResultCount },
  } = await FundsApi.getFunds({
    filterParameters: {},
    sortParameters: [],
    pagesParameters: { page: 1, pageSize: 25 },
  })

  const { data: codelists } = await CodelistsApi.getCodelists()

  const { data: assetClasses } = await FundsApi.getAssetClasses()

  return {
    funds,
    queryId,
    totalPageCount,
    totalResultCount,
    codelists,
    assetClasses,
    namespacesRequired: ['funds'],
  }
}

export default Funds
