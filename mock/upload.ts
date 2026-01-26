export default {
  'POST /api/upload': (req: any, res: any) => {
    res.status(200);
    setTimeout(() => {
      res.json({
        url: 'https://example.com/path/to/uploaded/file.jpg',
      });
    }, 3000);
  },
};
