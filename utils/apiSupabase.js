function getUrlBase() {
  // return "http://localhost:8080/api/";
  // return "https://wbgctstptayrxskwaqld.supabase.co/auth/v1/token?grant_type=password/";
  return "https://wbgctstptayrxskwaqld.supabase.co/";
}

function getApiKeySupabase() {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZ2N0c3RwdGF5cnhza3dhcWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5NTM5NzgsImV4cCI6MjA0NDUyOTk3OH0.6qOP2ANbwnxHosWnupL8Wbdhl7AtpZNAOrcBZ91Hzzk';
}

function getHeaders(isSupabase = true, isAuthenticated = false) {
  if(isSupabase){
    if(isAuthenticated){
      const access_token = localStorage.getItem("access_token");
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": getApiKeySupabase(),
        "Authorization":"Bearer " + access_token
      };
    }

    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "apikey": getApiKeySupabase()
    };
  }

  return {
      "Content-Type": "application/json",
      "Accept" : "application/json",
  };
}

function callApi(method, rota, fn = false, isSupabase = true, isAuthenticated = false) {
  const url = getUrlBase(isSupabase, isAuthenticated) + rota;

  try {
      fetch(url, {
          method: method, // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: getHeaders(),
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer",
      })
          .then((response) => response.json())
          .then((data) => {
              let oRetorno = JSON.stringify(data);

              console.log(data);
              // Se existir a funcao, executa a funcao
              // passando por parametro o retorno da API
              if (fn) {
                  // executando a funcao
                  fn(data);
              }
          });
  } catch (error) {
      console.log("Erro:" + error);
  }
}

function callApiPost(method, rota, fn = false, body = false, isSupabase = true, isAuthenticated = false) {
  const url = getUrlBase(isSupabase, isAuthenticated) + rota;

  console.log("url chamada:" + url);
  try {
      fetch(url, {
          method: method, // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: getHeaders(),
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer",
          body: JSON.stringify(body),
      })
          .then((response) => response.json())
          .then((data) => {
              let oRetorno = JSON.stringify(data);

              console.log(data);
              // Se existir a funcao, executa a funcao
              // passando por parametro o retorno da API
              if (fn) {
                  // executando a funcao
                  fn(data);
              }
          });
  } catch (error) {
      console.log("Erro:" + error);
  }
}
