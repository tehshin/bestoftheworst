using AutoMapper;
using BestOfTheWorst.Server.Infrastructure.AutoMapper.Resolver;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.ViewModels;

namespace BestOfTheWorst.Server.Infrastructure.AutoMapper.Profiles
{
    public class MovieProfile : Profile
    {
        public MovieProfile()
        {
            CreateMap<CreateMovieViewModel, Movie>()
                .ForMember(dest => dest.Tags, opt => opt.ResolveUsing<StringTagResolver>());

            CreateMap<UpdateMovieViewModel, Movie>();
        }
    }
}