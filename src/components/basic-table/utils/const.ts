const tableSetting = {
  apiSetting: {
    // 当前页的字段名
    currentField: 'current',
    // 每页数量字段名
    sizeField: 'size',
    // 接口返回的数据字段名
    recordsField: 'records',
    // 接口返回总页数字段名
    pagesField: 'pages',
    //总数字段名
    totalField: 'total',
    // 请求当前页的字段名
    currentFetchField: 'pageNum',
    // 请求每页数量的字段名
    pageSizeFetchField: 'pageSize'
  },
  //默认分页数量
  defaultPageSize: 10,
  //可切换每页数量集合
  pageSizes: [10, 20, 30, 40, 50]
};

const { apiSetting, defaultPageSize, pageSizes } = tableSetting;

export const DEFAULTPAGESIZE = defaultPageSize;

export const APISETTING = apiSetting;

export const PAGESIZES = pageSizes;
