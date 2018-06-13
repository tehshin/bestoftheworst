using System;
using System.Collections.Generic;

namespace BestOfTheWorst.Server.Models
{
    public class PaginatedList<T> : List<T>
    {
        public int PageIndex { get; private set; }

        public int PageSize { get; private set; }

        public int TotalItems { get; private set; }

        public int TotalPages { get; private set; }

        public PaginatedList(List<T> items, int count, int pageIndex, int pageSize)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalItems = count;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);

            this.AddRange(items);
        }
    }
}