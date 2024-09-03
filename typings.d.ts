declare var process: Process;

interface Process {
 env: Env
}

interface Env {
    secretKey: string;
    apiUrl: string;    
    siteUrl: string;
    apiEndpoint: string;    
    domainCookie: string;
    pathCookie: string;
}