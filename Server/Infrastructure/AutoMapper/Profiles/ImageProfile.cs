using AutoMapper;
using BestOfTheWorst.Server.Infrastructure.AutoMapper.Resolver;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace BestOfTheWorst.Server.Infrastructure.AutoMapper.Profiles
{
    public class ImageProfile : Profile
    {
        public ImageProfile(IUrlHelper urlHelper)
        {
            CreateMap<Image, ImageViewModel>()
                .ForMember(i => i.ImageUrl, o => o.ResolveUsing(new ImageUrlResolver(urlHelper)));
        }
    }
}