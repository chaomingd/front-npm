import { useDebounceFn } from 'ahooks';
import React, { useEffect } from 'react'

function searchApi(keyword: string): Promise<string> {

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`result for ${keyword}`);
    }, Math.random() > 0.5 ? 1000 : 3000);
  })
}

export default function() {
  const [keyword, setKeyword] = React.useState('');
  const [result, setResult] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const {run: handleSearch} = useDebounceFn(async (kw: string) => {
    setLoading(true);
    const res = await searchApi(kw);
    setResult(res);
    setLoading(false);
  }, {
    wait: 300
  })

  useEffect(() => {
    if (keyword) {
      handleSearch(keyword)
    }
  }, [keyword])

  return (
    <div style={{
      color: '#000'
    }}>
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <div>
        {loading ? 'loading...' : result}
      </div>
    </div>
  )
}
