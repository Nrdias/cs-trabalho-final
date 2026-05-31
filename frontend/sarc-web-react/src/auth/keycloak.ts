import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8081',
  realm: 'sarc-realm',
  clientId: 'sarc-web-react',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
