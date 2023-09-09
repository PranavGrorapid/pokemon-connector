var cc = DataStudioApp.createCommunityConnector();

// Authentication Type
function getAuthType() {
  return cc
    .newAuthTypeResponse()
    .setAuthType(cc.AuthType.NONE) // Modify this if authentication is required
    .build();
}

function getConfig() {
  var config = cc.getConfig();

  config
    .newSelectSingle()
    .setId("exampleSelectSingle")
    .setName("Select single")
    .addOption(
      config.newOptionBuilder().setLabel("Lorum foo").setValue("lorem")
    )
    .addOption(
      config.newOptionBuilder().setLabel("Ipsum Bar").setValue("ipsum")
    )
    .addOption(config.newOptionBuilder().setLabel("Sit").setValue("amet"));

  return config.build();
}

function defineFields() {
  const fields = cc.getFields();
  const types = cc.FieldType;

  fields
    .newDimension()
    .setId("name") 
    .setName("Name")
    .setDescription("The name of the habitat")
    .setType(types.TEXT);

  fields
    .newDimension()
    .setId("url") 
    .setName("URL")
    .setDescription("The URL of the habitat")
    .setType(types.URL);

  return fields;
}

function getSchema(request) {
  return { schema: defineFields().build() };
}

function fetchData() {
  

  let res = UrlFetchApp.fetch("https://pokeapi.co/api/v2/pokemon-habitat/"); 
  let data = JSON.parse(res);

  return data;
}

function getData(request) {
  const data = fetchData();

  // Define the requested fields
  let requestedFields = request.fields.map((field) => field.name);

  // Create an array to hold the data rows
  let rows = [];

  // Loop through the data and extract the requested fields
  data.results.forEach((item) => {
    let row = [];
    requestedFields.forEach((field) => {
      switch (field) {
        case "name":
          row.push(item.name);
          break;
        case "url":
          row.push(item.url);
          break;
        
        default:
          row.push(null); 
          break;
      }
    });
    rows.push(row);
  });

  let fields = defineFields().forIds(requestedFields);

  // Create a data response object to display on chart
  var dataResponse = cc.newGetDataResponse();

  dataResponse.setFields(fields).addAllRows(rows);

  return dataResponse.build();
}
