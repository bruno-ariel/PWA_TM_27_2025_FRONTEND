const getWorkspaces = async () => {
        const response = await fetch(ENVIROMENT.API_URL + '/api/workspace', {
            method: 'GET',
            headers: getAuthentitedHeaders()
        })
        const responseData = await response.json()
        console.log(responseData)
    }
    getWorkspaces()

    