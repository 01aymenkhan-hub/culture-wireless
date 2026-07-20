# Guides Documentation

## Welcome

### Welcome

#### Welcome

The Coverage API allows you to integrate nationwide cellular signal strength data directly into your applications and services. You can retrieve coverage and signal strength data for any major U.S. carrier and supported technology, including 4G and 5G.

This documentation provides everything you need to start integrating:

- Information about the data sources and methodologies
- API structure and base URL usage
- Authentication using API keys and domain restrictions
- Detailed explanation of each endpoint
- Guidelines for caching, usage limits, and best practices

Whether you're building your own mapping application, analyzing coverage data, or integrating with existing systems, this API provides a powerful and flexible solution for accessing up-to-date and accurate nationwide cellular signal strength information.



### Data

#### Where Does The Data Come From?

All data is sourced directly from the FCC Broadband Data Collection. Our system processes this data to create a unified, queryable nationwide signal strength dataset for all major U.S. carriers.

#### We make it easy for you!

We have a sophisticated data pipeline that ingests, processes, and serves this data in real-time. We handle all the complexities of data processing, so you can focus on building your applications. We will handle the following for you:

- Support for multiple technologies (4G, 5G) and providers (AT&T, Verizon, T-Mobile, etc.).
- Automatic updates to the latest FCC data twice per year, ensuring you always have the most current coverage information. This is done without any action required on your part. Our turn around time for processing the latest FCC data is typically 1 to 2 days after the FCC releases the data.
- Leveraging our own proprietary data processing pipeline to handle discrepancies, inconsistencies, and data quality issues in the FCC data. We strive to provide the most accurate and reliable coverage information possible, allowing accurate comparisons between providers and technologies.
- Single or batch querying of signal strength data, allowing you to retrieve coverage information for specific areas or regions without needing to download large datasets.
- Latitude and Longitude, or Address based querying to allow any application to easily retrieve coverage information for a specific location.
- Computing signal strength values in dBm over areas and coverage percentages.
- Handle API authentication and authorization so you can securely access the data without worrying about managing API keys, or having your keys used by third parties.

#### Signal Strength Data

We leverage signal strength data from across the country to generate our data, including the average signal strength values and coverage percentages. We use our own proprietary algorithms to process this data and provide accurate coverage information.

Signal strength values are represented as floating point numbers in dBm, which is a standard unit for measuring signal strength. The values range from -120 dBm (no signal) to -50 dBm (excellent signal). You can use these values to determine the quality of the signal in a specific area and make informed decisions about coverage and performance.

#### Available Providers & Technologies

The API currently supports the following providers and technologies:

- **AT&T** - 4G, 5G
- **Verizon** - 4G, 5G
- **T-Mobile** - 4G, 5G
- **US Cellular** - 4G, 5G
- **Boost Mobile** - 5G

We support an additional 15 regional providers around the United States that are available upon request. If you are interested in accessing these providers, please contact our support team.



### Billing

#### Billing

The CoverageMap API uses a pay-per-usage model. You are billed for each unique location requested, regardless of which providers and technologies you request. Data is served in a JSON format, and each location corresponds to a single request.

##### What Triggers Billing

- Every successful request to the lookup endpoint counts as **1 billed request**
- Whether you request a single provider/technology or multiple providers/technologies, you will only be billed once
- Repeat requests for the same location will be billed for each request, not once regardless of when the request was made
- Requests using the **batch** endpoint will be billed for each location in the batch

##### What Does NOT Trigger Billing

- Failed requests where the request was improperly formatted or the requested provider/technology does not exist will not be billed
- Requests that include an address that does not exist or is not found will not be billed
- GET requests to the **Providers** endpoint — this is free and unlimited

##### Important Billing Notes

Billing usage is tracked on a per-day basis and is updated in realtime. You can view your current usage and costs in the **Subscriptions** section of your enterprise dashboard. Past usage and costs are available in the **Invoices** section.

For custom billing plans, higher volume pricing, or usage concerns, please contact our support team.



## API

### Structure

#### API Structure

The API is organized around standard web API principles, using standard HTTP methods and status codes. Each endpoint is versioned, and uses the following format:

- **Base URL:** https://enterprise.coveragemap.com/api/v1
- **Versioning:** All API endpoints are versioned. Include the version number in the URL (e.g., /v1/).
- **HTTP Methods:** Use standard HTTP methods (GET, POST, PUT, DELETE) for all requests.

##### API Response

All API responses are returned in a JSON format (unless otherwise specified), with the following structure:

```
{
    "status": 200,
    "messages": {
        "error": [],
        "success": []
    },
    "data": { ... }
}
```

The response object contains the following fields:

- **status:** The HTTP status code of the response, such as 200 for success or 400 for bad request.
- **messages:** An object containing any messages or errors related to the request. This can be empty if there are no messages. Contains 2 optional fields, **error** and **success**, which represent a string array of messages.
- **data:** The main data payload of the response. This can be any object, depending on the endpoint being called. If there is no data to return, this field will be an empty JSON Object.



### Authorization

#### API Authorization

To access the API, you must pass your API key either as a request header or as a query parameter. A default key was generated for you when your subscription was created, but you can also create additional keys under the **API Keys** section in the dashboard.

To use your key as a request header, include the following header in your request:

```
Authorization: Bearer YOUR_API_KEY
```

Alternatively, you can include the key as a query parameter in your request URL:

```
?apiKey=YOUR_API_KEY
```

You can restrict keys to specific domains by setting the **Associated Domains** property when creating or updating keys. The key will only be valid for requests originating from those domains by checking the **Referer** header in the request. This ensures the API can only be used by your applications, enhancing security and preventing unauthorized access or usage. We recommend doing this for all keys used in production environments to prevent misuse. To restrict domains for an existing key, go to the **API Keys** section on the dashboard and set the **Associated Domains** property. If no domains are set, the key can be used freely from any domain.



### Endpoints

#### API Endpoints

The Coverage Lat/Long Summary API provides endpoints to retrieve signal strength and coverage data for specific locations. It consists of 3 endpoints: one for single location lookups, one for batch location lookups, and another to retrieve the available providers and their technologies. While the providers API is an optional endpoint and you can instead use the static list of providers and technologies, it is recommended to use it to ensure you have the latest, up-to-date information.

All endpoints require an API key to be passed either as a request header or as a query parameter. Authorization is outlined in the **Authorization** section of the documentation.

##### GET Providers

Get the list of available providers and technologies that can be used with the API.

#### `GET` `https://enterprise.coveragemap.com/api/v1/signal-strength/providers`

**Response (JSON)**

**JSON**

```json
{
    "status": 200,
    "messages": {},
    "data": {
        "technologies": [
            {
                "code": "4G",
                "name": "LTE"
            },
            {
                "code": "5G",
                "name": "5G"
            }
        ],
        "providers": [
            {
                "code": "ATT",
                "name": "AT&T",
                "dataset": "Dec 2024",
                "defaultTechnology": "4G",
                "supportedTechnologies": [
                    "4G",
                    "5G"
                ]
            },
            {
                "code": "DISH",
                "name": "Boost Mobile",
                "dataset": "Dec 2024",
                "defaultTechnology": "5G",
                "supportedTechnologies": [
                    "5G"
                ]
            },
            {
                "code": "TMO",
                "name": "T-Mobile",
                "dataset": "Dec 2024",
                "defaultTechnology": "4G",
                "supportedTechnologies": [
                    "4G",
                    "5G"
                ]
            },
            {
                "code": "USC",
                "name": "US Cellular",
                "dataset": "Dec 2024",
                "defaultTechnology": "4G",
                "supportedTechnologies": [
                    "4G",
                    "5G"
                ]
            },
            {
                "code": "VZW",
                "name": "Verizon",
                "dataset": "Dec 2024",
                "defaultTechnology": "4G",
                "supportedTechnologies": [
                    "4G",
                    "5G"
                ]
            }
        ]
    }
}
```

The **technologies** field lists all technologies supported by the system, such as 4G and 5G.

The **providers** field lists all providers (carriers) that are available. It includes the following fields:

- **code**: The provider code passed into the API, such as "ATT" for AT&T or "VZW" for Verizon.
- **name**: The name of the provider, such as "AT&T" or "Verizon".
- **dataset**: The name of the dataset currently used for the provider, such as "Dec 2024". This does not follow any specific format, but is a freeform string used to indicate the dataset version.
- **defaultTechnology**: The primary coverage layer used by this provider, such as LTE for Verizon.
- **supportedTechnologies**: An array of technology codes that are available for the provider through the API.

This API is not billed and can be requested as many times as needed without any limits or charges. It is recommended to use this endpoint to get the latest provider and technology information.

##### GET Lookup

Get signal strength and coverage data for a specific location. You can query by latitude/longitude coordinates or by address. The response includes coverage data for all requested providers and technologies.

#### `GET` `https://enterprise.coveragemap.com/api/v1/signal-strength/lookup?latitude={latitude}&longitude={longitude}&address={address}&providers={providers}&technologies={technologies}`

**Response (JSON)**

**JSON**

```json
[
   {
     "provider": {
       "code": "ATT",
       "name": "AT&T"
     },
     "technology": {
       "code": "4G",
       "name": "4G"
     },
     "signal": {
       "signal": -85.5,
       "quarterMile": -82.3,
       "halfMile": -88.7,
       "oneMile": -95.2
     },
     "coverage": {
       "quarterMile": 0.95,
       "halfMile": 0.87,
       "oneMile": 0.72
     }
   },
   {
     "provider": {
       "code": "VZW",
       "name": "Verizon"
     },
     "technology": {
       "code": "5G",
       "name": "5G"
     },
     "signal": {
       "signal": -78.2,
       "quarterMile": -75.1,
       "halfMile": -81.4,
       "oneMile": -89.6
     },
     "coverage": {
       "quarterMile": 0.98,
       "halfMile": 0.92,
       "oneMile": 0.85
     }
   }
 ]
```

The query parameters are as follows:

- **latitude** (optional): The latitude coordinate as a decimal number (e.g., "38.8911"). Must be provided with longitude if not using address.
- **longitude** (optional): The longitude coordinate as a decimal number (e.g., "-77.0364"). Must be provided with latitude if not using address.
- **address** (optional): A street address (e.g., "1600 Pennsylvania Ave NW, Washington, DC 20500"). Must be provided if not using latitude/longitude.
- **providers** (optional): Comma-separated list of provider codes (e.g., "ATT,VZW"). If not provided, all available providers will be returned.
- **technologies** (optional): Comma-separated list of technology codes (e.g., "4G,5G"). If not provided, all available technologies will be returned.

**Note:** You must provide either latitude/longitude coordinates OR an address. Providing neither will result in an error. Providing both will prioritize the latitude/longitude coordinates.

##### POST Batch Lookup

Get signal strength and coverage data for multiple locations in a single request. This is more efficient and faster when handling large batches of locations. Supports up to 100 locations per request.

#### `POST` `https://enterprise.coveragemap.com/api/v1/signal-strength/lookup/batch`

**Response (JSON)**

**JSON**

```json
[
   {
     "latitude": 38.8911,
     "longitude": -77.0364,
     "coverage": [
       {
         "provider": {
           "code": "ATT",
           "name": "AT&T"
         },
         "technology": {
           "code": "4G",
           "name": "LTE"
         },
         "signal": {
           "signal": -85.5,
           "quarterMile": -82.3,
           "halfMile": -88.7,
           "oneMile": -95.2
         },
         "coverage": {
           "quarterMile": 0.95,
           "halfMile": 0.87,
           "oneMile": 0.72
         }
       }
     ]
   },
   {
     "latitude": 38.897684,
     "longitude": -77.036574,
     "address": "1600 Pennsylvania Ave NW, Washington, DC 20500",
     "confidence": "exact",
     "coverage": [
       {
         "provider": {
           "code": "VZW",
           "name": "Verizon"
         },
         "technology": {
           "code": "5G",
           "name": "5G"
         },
         "signal": {
           "signal": -78.2,
           "quarterMile": -75.1,
           "halfMile": -81.4,
           "oneMile": -89.6
         },
         "coverage": {
           "quarterMile": 0.98,
           "halfMile": 0.92,
           "oneMile": 0.85
         }
       }
     ]
   }
 ]
```

The request body should be a JSON object with the following structure:

**JSON**

```json
{
  "providers": ["ATT", "VZW"],
  "technologies": ["4G"],
  "locations": [
    {
      "latitude": 38.8911,
      "longitude": -77.0364
    },
    {
      "address": "1600 Pennsylvania Ave NW, Washington, DC 20500"
    }
  ]
}
```

The request body parameters are as follows:

- **providers** (optional): Array of provider codes. If not provided, all available providers will be returned.
- **technologies** (optional): Array of technology codes. If not provided, all available technologies will be returned.
- **locations** (required): Array of location objects. Each location must have either latitude/longitude OR address.

**Note:** Each location in the batch request counts as a separate billed request. The batch endpoint is designed for efficiency in processing multiple locations, not for reducing billing costs.

##### Batch Response Format

The batch endpoint returns a top-level array where each element represents the result for one location from your request in the same order as the locations in the request. This format is unique to the batch endpoint and differs from the single lookup endpoint.

Each array element contains:

- **latitude** and **longitude**: The exact coordinates that were processed for this location. These will either match the latitude and longitude provided in the request or be set to the latitude and longitude of the address if an address was provided.
- **address**: The address that was processed for this location. This will match the address provided in the request if an address was provided.
- **confidence** (optional): The geocoding confidence rating for address to latitude/longitude lookups. Possible values are `exact`, `high`, `medium`, `low`. This is only returned for address-based lookups.
- **coverage**: An array containing the coverage data for all requested providers and technologies at this location
- **error** (optional): An error message if the location could not be processed.

**Important:** The response array will always contain the same number of elements as locations in your request, maintaining a 1:1 correspondence. If a location cannot be processed, it will include an error field instead of coverage data.

When provided, the **confidence** value can be used to determine how reliable the geocoded location is before acting on the returned coverage results.

##### Response Format

Both endpoints return coverage data in the following JSON format:

**JSON**

```json
[
  {
    "provider": {
      "code": "ATT",
      "name": "AT&T"
    },
    "technology": {
      "code": "4G",
      "name": "LTE"
    },
    "signal": {
      "signal": -85.5,
      "quarterMile": -82.3,
      "halfMile": -88.7,
      "oneMile": -95.2
    },
    "coverage": {
      "quarterMile": 0.95,
      "halfMile": 0.87,
      "oneMile": 0.72
    }             
  }
]
```

The response fields are as follows:

- **provider**: Object containing the provider code and name
- **technology**: Object containing the technology code and name
- **signal**: Object containing signal strength values in dBm for different coverage areas
- **coverage**: Object containing coverage percentages for different distances

##### Signal Strength Values

The **signal** object contains signal strength measurements in dBm (decibels relative to milliwatts) for different coverage areas:

- **signal**: The signal strength value at the exact location coordinates
- **quarterMile**: Average signal strength within a quarter-mile radius centered on the location
- **halfMile**: Average signal strength within a half-mile radius centered on the location
- **oneMile**: Average signal strength within a one-mile radius centered on the location

Signal strength values range from -120 dBm (no signal) to -50 dBm (excellent signal). Typical values are:

- **-50 to -70 dBm**: Excellent signal strength, typically found very close to cell towers
- **-70 to -85 dBm**: Good signal strength, suitable for most applications
- **-85 to -100 dBm**: Fair signal strength, may experience some connectivity issues
- **-100 to -120 dBm**: Poor signal strength, likely to have connectivity problems

##### Coverage Percentages

The **coverage** object contains percentage values representing the total coverage area for the location.

- **quarterMile**: Percentage of the area covered by the provider's network within a quarter-mile radius
- **halfMile**: Percentage of the area covered by the provider's network within a half-mile radius
- **oneMile**: Percentage of the area covered by the provider's network within a one-mile radius

Coverage percentages range from 0.0 (0%) to 1.0 (100%). For example, a value of 0.95 means there's a 95% of the area covered by the provider's network.



### Limits

#### API Limits

The API has the following limits to ensure fair usage and prevent abuse, as well as allowing for accurate billing. Failure to comply with these limits may result in throttling or termination of your API access.

##### Requests

The API is designed to scale with your usage, so there exists no hard limit on the number of requests you can make to the API. However, we do monitor usage patterns and may throttle or block requests that appear to be abusive or excessive. This is to ensure that the API remains available and responsive for all users. This includes, but is not limited to, blocking denial of service attacks, excessive requests from a single IP address, data scraping, or other patterns that may indicate abuse.

If you plan on making a large number of requests in a short period of time, please utilize the batch lookup endpoint to reduce the number of requests you need to make.

##### Batch Processing

The batch lookup endpoint has a maximum limit of 100 locations per request. This limit is designed to prevent abuse and ensure the API remains responsive for all users. If you need to process more than 100 locations, you should split your requests into multiple batches.

##### Storage & Caching

You may persist, cache, download, and store API responses to your own infrastructure for any period of time during or after your subscription. You receive an indefinite license to use the data following the terms of the license agreement.
