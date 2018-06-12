using System.Collections.Generic;
using System.IO;
using AutoMapper;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace BestOfTheWorst.Server.Infrastructure.AutoMapper.Resolver
{
    public class ImageUrlResolver : IValueResolver<Image, object, string>
    {
        private readonly IUrlHelper _urlHelper;

        public ImageUrlResolver(IUrlHelper urlHelper)
        {
            _urlHelper = urlHelper;
        }

        public string Resolve(Image source, object destination, string destMember, ResolutionContext context)
        {
            string basePath = "~/";

            if (!string.IsNullOrEmpty(source.Path))
            {
                basePath = Path.Combine(basePath, source.Path);
            }

            return _urlHelper.Content(
                Path.Combine(basePath, $"{source.Id}.jpg"));
        }
    }
}