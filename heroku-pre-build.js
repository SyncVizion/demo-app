var fs = require('fs');
var str = `
export const environment = {
    tag: 'PRODUCTION',
    production: true,
    isLocal: false,
    siteUrl: '${process.env.siteUrl}',
    apiUrl: '${process.env.apiUrl}',
    githubProject: '${process.env.githubProject}',
    githubProjectsFieldId: '${process.env.githubProjectsFieldId}',
    githubCreatedUserFieldId: '${process.env.githubCreatedUserFieldId}',
    githubCreatedUserIdFieldId: '${process.env.githubCreatedUserIdFieldId}',
    githubProjectStatusId: '${process.env.githubProjectStatusId}',
    githubPat: '${process.env.githubPat}',
    companyName: '${process.env.companyName}',
    companyFolder: '${process.env.companyFolder}',
    auth0Domain: '${process.env.auth0Domain}',
    auth0ClientId: '${process.env.auth0ClientId}',
    auth0Audience: '${process.env.auth0Audience}',
    auth0AllowedList: ['${process.env.auth0AllowedList}'],
};
`;

console.log('Generating Production Environment File...');
fs.writeFile('./src/environments/environment.production.ts', str, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log('Production Environment File Created');
});
