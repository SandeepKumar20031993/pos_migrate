

export const getSessionValue = (key) => {

    if (typeof window !== 'undefined') {
        return sessionStorage.getItem(key)
    }
    return null
} 