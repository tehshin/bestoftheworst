using AutoMapper;
using BestOfTheWorst.Server.Infrastructure.AutoMapper.Resolver;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.ViewModels;

namespace BestOfTheWorst.Server.Infrastructure.AutoMapper.Profiles
{
    public class AppUserProfile : Profile
    {
        public AppUserProfile()
        {
            CreateMap<AppUser, UserInfoViewModel>()
                .ForMember(dest => dest.GravatarHash, opt => opt.ResolveUsing<GravatarResolver>());
        }
    }
}