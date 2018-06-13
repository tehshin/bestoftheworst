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
                .ForMember(dest => dest.Tags, opt => opt.ResolveUsing<StringTagResolver>())
                .ForMember(dest => dest.ImageId, opt => opt.MapFrom(_ => _.Image))
                .ForMember(dest => dest.Image, opt => opt.Ignore());

            CreateMap<UpdateMovieViewModel, Movie>();
        }
    }
}