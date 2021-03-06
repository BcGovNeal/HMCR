﻿using Microsoft.Extensions.DependencyInjection;
using System;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;

namespace Hmcr.Chris
{
    public static class ChrisServiceCollectionExtensions
    {
        public static void AddChrisHttpClient(this IServiceCollection services, IConfiguration config)
        {
            services.AddHttpClient<IMapsApi, MapsApi>(client =>
            {
                client.BaseAddress = new Uri(config.GetValue<string>("CHRIS_MAP_URL"));
                client.Timeout = new TimeSpan(0, 0, 15);
                client.DefaultRequestHeaders.Clear();
            });

            services.AddHttpClient<IOasApi, OasApi>(client =>
            {
                client.BaseAddress = new Uri(config.GetValue<string>("CHRIS_OAS_URL"));
                client.Timeout = new TimeSpan(0, 0, 15);
                client.DefaultRequestHeaders.Clear();

                var userId = config.GetValue<string>("CHRIS_USER");
                var password = config.GetValue<string>("CHRIS_PASSWORD");
                var basicAuth = Convert.ToBase64String(Encoding.GetEncoding("ISO-8859-1").GetBytes($"{userId}:{password}"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicAuth);
            });

            services.AddScoped<IApi, Api>();
        }
    }
}
