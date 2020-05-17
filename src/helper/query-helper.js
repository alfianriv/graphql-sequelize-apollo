export const queryHelper = (options) => {
    const queryOptions = {}

    if (options) {
        queryOptions.limit = 10

        if (options.limit) {
            queryOptions.limit = options.limit
        }

        if (options.order && options.order.length > 0) {
            queryOptions.order = []
            options.order.map(value => {
                queryOptions.order.push([value.sort, value.order])
            })
        }

        if (options.where && options.where.length > 0) {
            queryOptions.where = {}
            options.where.map(value => {
                Object.assign(queryOptions.where, {
                    [value.field]: value.value
                })
            })
        }
    }

    return queryOptions
}