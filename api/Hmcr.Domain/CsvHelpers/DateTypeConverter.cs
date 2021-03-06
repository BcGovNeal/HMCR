﻿using CsvHelper;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace Hmcr.Domain.CsvHelpers
{
    public class DateTypeConverter : ITypeConverter
    {
        public object ConvertFromString(string date, IReaderRow row, MemberMapData memberMapData)
        {
            if (string.IsNullOrEmpty(date))
                return null;

            return DateTime.ParseExact(date, "yyyyMMdd", CultureInfo.InvariantCulture);
        }

        public string ConvertToString(object value, IWriterRow row, MemberMapData memberMapData)
        {
            throw new NotImplementedException();
        }
    }
}
