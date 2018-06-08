using System.Collections.Generic;
using AutoMapper;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.ViewModels;

namespace BestOfTheWorst.Server.Infrastructure.AutoMapper.Resolver
{
    public class StringTagResolver : IValueResolver<CreateMovieViewModel, object, IList<Tag>>
    {
        public IList<Tag> Resolve(CreateMovieViewModel source, object destination, IList<Tag> destMember, ResolutionContext context)
        {
            var tags = new List<Tag>();
            foreach (var tag in source.Tags)
            {
                tags.Add(new Tag { Name = tag });
            }

            return tags;
        }
    }
}