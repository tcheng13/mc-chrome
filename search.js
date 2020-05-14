var SiteSearchClient = require("@elastic/site-search-node");
var client = new SiteSearchClient({
  apiKey: 'rUg_ry1GAT1j8ktXXHxy'
});

client.search(
    {
      engine: "plums-en",
      q: "Create",
    }, function(err, res) {
      // console.log(res.records.page);
      result = []
      for (i = 0; i < 6; i++) {
        result.push([res.records.page[i].title, res.records.page[i].description, res.records.page[i].url])
      }
      console.log(result)
    }
  );