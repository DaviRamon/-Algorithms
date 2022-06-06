const axios = require('axios');
const { get, concat } = require('lodash');
const makeResponse = require('../../response/default-response');

const getPlantDetail = async (portalCookie, unitID) => {

  let data = `currPage=1&plantId=${unitID}`;
  let config = {
    method: 'post',
    url: 'https://server.smten.com/panel/getDevicesByPlantList',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'cookie': portalCookie,
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest'
    },
    data: data
  };

  let response = await axios(config)
    .then(function (result) { return result })
    .catch(function (error) {   //console.log(Object.keys(error))
      return makeResponse('false', 'unavailable', error.message)
    })

  return response

}

module.exports.main = async (portalCookie, unitID) => {

  try {
    const responseGetPlantDetail = await getPlantDetail(portalCookie, unitID);

    if (responseGetPlantDetail.data.result) {
      console.log("oi", responseGetPlantDetail.data.obj.datas);

      // algumas unidades possuem mais de um inversor. Essa função soma esses valores e retorna o total.
      const getSistemSize = async () => {

        let sizeIndividualInversores = [];
        for (let i = 0; i < responseGetPlantDetail.data.obj.datas.length; i++) {
          sizeIndividualInversores.push(parseInt(responseGetPlantDetail.data.obj.datas[i].nominalPower))

        }

        let sizeTotalPlanta = 0;
        for (let i = 0; i < sizeIndividualInversores.length; i++) {
          sizeTotalPlanta += sizeIndividualInversores[i]

        }

        return sizeTotalPlanta;
      }

      const getGeneratedTotalEnergy = async () => {
        let totalEnergiaIndivialInversor = [];
        for (let i = 0; i < responseGetPlantDetail.data.obj.datas.length; i++) {
          totalEnergiaIndivialInversor.push(parseInt(responseGetPlantDetail.data.obj.datas[i].eTotal))

        }

        let totalEnergiaGeradaPlanta = 0;
        for (let i = 0; i < totalEnergiaIndivialInversor.length; i++) {
          totalEnergiaGeradaPlanta += totalEnergiaIndivialInversor[i]

        }

        return totalEnergiaGeradaPlanta;
      }
      
      const getTimezone = async () => {

        let getTimezone = responseGetPlantDetail.data.obj.datas[0].timezone;
        let timezone = getTimezone.replace("-", "GMT-0");  
        return  timezone;

      }

      let sistemSize = await getSistemSize();
      let generatedTotalEnergy = await getGeneratedTotalEnergy();
      let responseGetTimezone = await getTimezone();

      return {
        execution: "true",
        event: "",
        content: {
          unitID: unitID,
          unitName: responseGetPlantDetail.data.obj.datas[0].plantName,
          installDate: "",
          systemSize: (sistemSize / 1000).toFixed(2),
          latitude: "",
          longitude: "",
          generatedTotalEnergy: generatedTotalEnergy.toFixed(2),
          timeZone: responseGetTimezone
        }
      }

    }
    else {
      //console.log(responseGetPlantDetail.data)

      // Algumas vezes a requisição terá sucesso, porém retornará um HTML informando a necessidade de fazer o login. 
      // Tratar este erro aqui  para o código  tentar a requisição novamente. 
      return makeResponse('false', 'session expired');
    }

  } catch (error) {

    return makeResponse('false', 'unavailable', error.message)
  }
}


