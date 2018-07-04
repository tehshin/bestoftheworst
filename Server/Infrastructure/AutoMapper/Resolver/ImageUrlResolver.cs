using System.Collections.Generic;
using System.IO;
using AutoMapper;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace BestOfTheWorst.Server.Infrastructure.AutoMapper.Resolver
{
    public class ImageUrlResolver : IValueResolver<Image, object, IDictionary<int, string>>
    {
        private readonly IUrlHelper _urlHelper;

        public ImageUrlResolver(IUrlHelper urlHelper)
        {
            _urlHelper = urlHelper;
        }

        public IDictionary<int, string> Resolve(Image source, object destination, IDictionary<int, string> destMember, ResolutionContext context)
        {
            var urls = new Dictionary<int, string>();
            string basePath = "~/";

            if (!string.IsNullOrEmpty(source.Path))
            {
                basePath = $"{basePath}{source.Path.TrimEnd('/').TrimStart('/')}";
            }

            urls.Add(500, _urlHelper.Content($"{basePath}/{source.Id}_500.jpg"));
            urls.Add(250, _urlHelper.Content($"{basePath}/{source.Id}_250.jpg"));
            urls.Add(100, _urlHelper.Content($"{basePath}/{source.Id}_100.jpg"));

            return urls;
        }
    }
}