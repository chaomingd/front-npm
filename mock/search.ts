export default {
  'GET /api/search': (req: any, res: any) => {
    setTimeout(() => {
      res.send({
        keyword: 'search result for ' + req.query.keyword
      });
    }, Math.random() > 0.5 ? 1000 : 3000);
  },
}
